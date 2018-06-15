"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_procesamiento_1 = require("./app-procesamiento");
const operativos_1 = require("operativos");
// import {emergeAppDatosExt} from "datos-ext"
const varcal_1 = require("varcal");
var AppProcesamiento = app_procesamiento_1.emergeAppProcesamiento(varcal_1.emergeAppVarCal(operativos_1.emergeAppOperativos(operativos_1.AppBackend)));
// TODO AGREGAR A HERENCIA DATOS EXT asi:
// var AppProcesamiento = emergeAppProcesamiento(emergeAppVarCal(emergeAppDatosExt(emergeAppOperativos(AppBackend))));
new AppProcesamiento().start();
//# sourceMappingURL=server-procesamiento.js.map