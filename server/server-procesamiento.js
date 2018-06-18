"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_procesamiento_1 = require("./app-procesamiento");
const operativos_1 = require("operativos");
const datos_ext_1 = require("datos-ext");
const varcal_1 = require("varcal");
// var AppProcesamiento = emergeAppProcesamiento(emergeAppVarCal(emergeAppOperativos(AppBackend)));
// TODO AGREGAR A HERENCIA DATOS EXT asi:
var AppProcesamiento = app_procesamiento_1.emergeAppProcesamiento(varcal_1.emergeAppVarCal(datos_ext_1.emergeAppDatosExt(operativos_1.emergeAppOperativos(operativos_1.AppBackend))));
new AppProcesamiento().start();
//# sourceMappingURL=server-procesamiento.js.map