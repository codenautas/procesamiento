"use strict";

import * as varcal from "varcal";
import {ProceduresProcesamiento} from "./procedures-procesamiento";

export type Constructor<T> = new(...args: any[]) => T;
export function emergeAppProcesamiento<T extends Constructor<varcal.VarCalType>>(Base:T){
    
    return class AppProcesamiento extends Base{
        constructor(...args:any[]){ 
            super(...args);
        }
        getProcedures(){
            //TODO: es igual que en datos-ext llevarlo a varcal
            var be = this;
            return super.getProcedures().then(function(procedures){
                return procedures.concat(
                    ProceduresProcesamiento.map(be.procedureDefCompleter, be)
                );
            });
        }    
        // clientIncludes(req:varcal.Request, hideBEPlusInclusions:boolean){
        //     //TODO: es igual que en datos-ext llevarlo a varcal
        //     return super.clientIncludes(req, hideBEPlusInclusions).concat([
        //         {type:'js' , src:'client/procesamiento.js'},
        //     ])
        // }
        getMenu():varcal.MenuDefinition{
            //TODO: es igual que en datos-ext llevarlo a varcal
            let myMenuPart:varcal.MenuInfo[]=[
                // {menuType:'table', name:'grupo_personas'}, // GENERAR DINAMICAMENTE A PARTIR DE UA
            ];
            let menu = {menu: super.getMenu().menu.concat(myMenuPart)}
            return menu;
        }
        prepareGetTables(){
            //TODO: es igual que en datos-ext llevarlo a varcal
            super.prepareGetTables();
            this.getTableDefinition={
                ...this.getTableDefinition,
                // grupo_personas // GENERAR DINAMICAMENTE A PARTIR DE UA
            }
        }
    }
}