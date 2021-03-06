"use strict";

import { Constructor, AppBackend, AppConsistenciasType, emergeAppConsistencias, emergeAppVarCal, emergeAppOperativos, OptsClientPage } from "consistencias";
import { emergeAppDatosExt, Request } from "datos-ext";
import {defConfig} from "./def-config";
import {procedures} from "./procedures-procesamiento"
export * from "./types-procesamiento";

export function emergeAppProcesamiento<T extends Constructor<AppConsistenciasType>>(Base:T){
    
    return class AppProcesamiento extends Base{
        constructor(...args:any[]){ 
            super(args);    
        }
        
        async getProcedures(){
            var parentProc = await super.getProcedures()
            return parentProc.concat(procedures);
        }

        clientIncludes(req:Request, hideBEPlusInclusions:OptsClientPage){
            return super.clientIncludes(req, hideBEPlusInclusions).concat([
                {type:'js', module: 'procesamiento', modPath: '../client', file: 'procesamiento.js', path: 'client_modules'}
            ])
        }

        configStaticConfig(){
          super.configStaticConfig();
          this.setStaticConfig(defConfig);
      }
    }
}

export var AppProcesamiento = emergeAppProcesamiento(emergeAppConsistencias(emergeAppVarCal(emergeAppDatosExt(emergeAppOperativos(AppBackend)))));
export type AppProcesamientoType = InstanceType<typeof AppProcesamiento>;