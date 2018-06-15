"use strict";

import {emergeAppProcesamiento} from "./app-procesamiento"
import {emergeAppOperativos, AppBackend} from "operativos"

var AppProcesamiento = emergeAppProcesamiento(emergeAppOperativos(AppBackend));

new AppProcesamiento().start();