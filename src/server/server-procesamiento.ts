"use strict";

import { AppBackend, emergeAppDatosExt, emergeAppOperativos } from "datos-ext";
import { emergeAppConsistencias } from "consistencias";
import { emergeAppExportador } from "exportador";
import { emergeAppVarCal } from "varcal";
import { emergeAppProcesamiento } from "./app-procesamiento";

var AppProcesamiento = emergeAppProcesamiento(emergeAppVarCal(emergeAppConsistencias(emergeAppExportador(emergeAppDatosExt(emergeAppOperativos(AppBackend))))));

new AppProcesamiento().start();