"use strict";

import {emergeAppProcesamiento} from "./app-procesamiento"
import {emergeAppOperativos, AppBackend} from "operativos"
import {emergeAppDatosExt} from "datos-ext"
import {emergeAppVarCal} from "varcal"

// var AppProcesamiento = emergeAppProcesamiento(emergeAppVarCal(emergeAppOperativos(AppBackend)));
// TODO AGREGAR A HERENCIA DATOS EXT asi:
var AppProcesamiento = emergeAppProcesamiento(emergeAppVarCal(emergeAppDatosExt(emergeAppOperativos(AppBackend))));

new AppProcesamiento().start();