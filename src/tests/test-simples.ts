import * as discrepances from 'discrepances';
import 'mocha';

import { AppProcesamiento, emergeAppProcesamiento } from '../server/app-procesamiento';

// Los tests que necesitan base de datos no están acá: sólo se prueba que la aplicación se arma bien.

describe("procesamiento", function () {
    it("exporta la función que emerge la aplicación", function () {
        discrepances.showAndThrow(typeof emergeAppProcesamiento, 'function');
    });
    it("arma la clase AppProcesamiento encadenando las capas anteriores", function () {
        discrepances.showAndThrow(typeof AppProcesamiento, 'function');
        discrepances.showAndThrow(AppProcesamiento.name, 'AppProcesamiento');
    });
    it("AppProcesamiento agrega sus procedures a los heredados", function () {
        discrepances.showAndThrow(typeof AppProcesamiento.prototype.getProcedures, 'function');
        discrepances.showAndThrow(typeof AppProcesamiento.prototype.clientIncludes, 'function');
    });
});
