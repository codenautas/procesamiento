# CLAUDE.md — procesamiento

Módulo de procesamiento (npm). Es la capa que se apoya en `consistencias` (y a través de ella en `varcal`, `operativos` y `datos-ext`) y arma la aplicación Backend-Plus completa: `AppProcesamiento = emergeAppProcesamiento(emergeAppConsistencias(emergeAppVarCal(emergeAppDatosExt(emergeAppOperativos(AppBackend)))))`. Lo usan `dmencu` y otros proyectos de codenautas, así que un cambio de comportamiento puede romper a los que dependen de él.

---

## Estructura de archivos

- `src/server/`: `app-procesamiento.ts` (punto de entrada, `emergeAppProcesamiento`), `def-config.ts`, `procedures-procesamiento.ts`, `server-procesamiento.ts`, `types-procesamiento.ts`.
- `src/client/`: código del cliente (`procesamiento.ts`, hoy vacío) y el logo.
- `src/tests/`: tests con Mocha (`test-simples.ts`).
- `dist/` (build) y `compile-for-test/` (tests compilados) se generan; no se versionan.

---

## Convenciones de código

- **Todos los tipos deben ser explícitos**. Prohibido usar `any` nuevo, casts vía `unknown`, o cualquier magia sin justificación. (Hay `any` heredados: no agregar más.)
  - En un `catch`, la variable es `unknown`: usar `(err as Error).message`.
- **Preservar el estilo existente** al modificar archivos: incluyendo el uso de `var` donde ya se usa.
- **No tocar el formato de lo que ya existe**: el diff de un cambio debe mostrar sólo las líneas que cambian de verdad.
  - No reindentar, no reformatear, no quitar ni agregar espacios al final de las líneas, y no agregar ni quitar el salto de línea final del archivo.
  - Respetar el fin de línea de cada archivo: hay archivos con CRLF y otros con LF. Las líneas nuevas van con el mismo fin de línea que el resto del archivo. Revisar con `git ls-files --eol <archivo>`.
  - En Windows no editar con `sed -i` ni herramientas que reescriban el archivo completo, porque pueden convertir CRLF a LF.
  - Antes de commitear, revisar `git diff --stat` contra `git diff --ignore-all-space --ignore-cr-at-eol --stat`. Si dan distinto, hay cambios de formato que hay que revertir.
- **Nunca repetir código**: antes de escribir una función o constante, buscar si ya existe y reutilizarla.
- Comentarios y mensajes en castellano, como el resto del código.

---

## Compilación

- **Compilación sin fallbacks**: el build y los tests no toleran errores de TypeScript. No agregar `|| echo "continue w/error"` a los scripts de `package.json`. Un error de compilación se corrige en el código.
- `npm run build` compila `src/server` y `src/client` a `dist/` y después corre `mixin-patch`.
- Si `mixin-patch` se cuelga sin salida, casi seguro hay un `.d.ts` viejo en `dist/` que dispara su regex (catastrophic backtracking). Solución: borrar `dist/` y volver a compilar.
- `npm install` / `npm ci` corren `prepare`, que hace el build.
- `package-lock.json` **se versiona**: el workflow de publicación usa `npm ci`. Si se cambian dependencias, commitear el lock actualizado.

---

## Casos de prueba

- **Framework**: Mocha. **Comando**: `npm test` (compila `src/tests` a `compile-for-test/` y corre los tests).
- **Archivo principal**: `src/tests/test-simples.ts`.
- Hoy el módulo casi no tiene lógica propia: los tests verifican que la aplicación se arma (exports y encadenado de capas). La lógica real está en las capas de abajo y necesita PostgreSQL, por lo que no se prueba acá. Si se agrega lógica propia, va con sus tests.
- Antes de commitear: `npm run build` y `npm test` tienen que pasar sin errores.

---

## Documentación

Mantener actualizado el `README.md` cuando se agreguen o cambien funcionalidades.

---

## Publicación

- `procesamiento` se publica en npm **sólo desde GitHub Actions** (`.github/workflows/publish.yml`, que usa el reusable `npm-publish-new-version.yaml@v3` de `codenautas/.github`). No hacer `npm publish` local.
- Para publicar: `npm version patch` (o `minor`/`major`), que sube `package.json`, hace el commit y crea el tag `vX.Y.Z`; después `git push --follow-tags`. El push del tag dispara el workflow.
- Un tag por versión. No crear ni pushear el tag antes de subir la versión en `package.json`. El workflow exige que el tag sea `v<versión de package.json>`.
- Alternativa: subir la versión sin tag, pushear a `master` y correr a mano **Actions → Publish → Run workflow**; en ese caso el workflow crea el tag.
- Requiere **Trusted publisher** configurado en npmjs.com para el paquete: organización `codenautas`, repositorio `procesamiento`, workflow `publish.yml`, sin environment, publicando directamente. Sin eso `npm publish` falla con 404.
- Versiones con `beta`, `alpha` o `rc` se publican con ese dist-tag y no con `latest`.
- npm no permite republicar una versión: si falló después de publicar, subir la versión.
