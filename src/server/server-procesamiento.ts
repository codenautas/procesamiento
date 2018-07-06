"use strict";

import {emergeAppProcesamiento} from "./app-procesamiento"
import {emergeAppDatosExt, emergeAppOperativos, AppBackend} from "datos-ext"
import {emergeAppVarCal} from "varcal"

var AppProcesamiento = emergeAppProcesamiento(emergeAppVarCal(emergeAppDatosExt(emergeAppOperativos(AppBackend))));

new AppProcesamiento().start();