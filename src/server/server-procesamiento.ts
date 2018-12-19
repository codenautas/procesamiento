"use strict";

import { AppBackend, emergeAppConsistencias, emergeAppOperativos, emergeAppVarCal } from "consistencias";
import { emergeAppDatosExt } from "datos-ext";
import { emergeAppProcesamiento } from "./app-procesamiento";

var AppProcesamiento = emergeAppProcesamiento(emergeAppConsistencias(emergeAppVarCal(emergeAppDatosExt(emergeAppOperativos(AppBackend)))));

new AppProcesamiento().start();