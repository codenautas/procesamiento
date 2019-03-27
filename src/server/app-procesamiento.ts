"use strict";

import { Constructor, AppBackend, AppConsistenciasType, emergeAppConsistencias, emergeAppVarCal, emergeAppOperativos } from "consistencias";
import { emergeAppDatosExt, Request } from "datos-ext";
export * from "./types-procesamiento";
import {defConfig} from "./def-config";

export function emergeAppProcesamiento<T extends Constructor<AppConsistenciasType>>(Base:T){
    
    return class AppProcesamiento extends Base{
        constructor(...args:any[]){ 
            super(args);    
            // NO COMITEAR
            // this.allClientFileNames.push({type:'js', module: 'procesamiento', modPath: '../client', file: 'procesamiento.js', path: 'client_modules'})
            //this.allClientFileNames.push({type:'js', src: 'client/procesamiento.js' })
        }
        
        async getProcedures(){
            var parentProc = await super.getProcedures()
            return parentProc.concat(procedures);
        }

        clientIncludes(req:Request, hideBEPlusInclusions?:boolean){
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