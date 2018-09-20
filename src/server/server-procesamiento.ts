"use strict";

import { AppBackend, emergeAppDatosExt, emergeAppOperativos } from "datos-ext";
import { emergeAppExportador } from "exportador";
import { emergeAppVarCal } from "varcal";
import { emergeAppProcesamiento } from "./app-procesamiento";

var AppProcesamiento = emergeAppProcesamiento(emergeAppVarCal(emergeAppExportador(emergeAppDatosExt(emergeAppOperativos(AppBackend)))));

new AppProcesamiento().start();