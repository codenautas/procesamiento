"use strict";

import { AppBackend, emergeAppOperativos, emergeAppDatosExt } from "datos-ext";
import { emergeAppVarCal, emergeAppConsistencias } from "consistencias";
// import { emergeAppExportador } from "exportador";
import { emergeAppProcesamiento } from "./app-procesamiento";

var AppProcesamiento = emergeAppProcesamiento(emergeAppConsistencias(emergeAppVarCal(emergeAppDatosExt(emergeAppOperativos(AppBackend)))));

new AppProcesamiento().start();