"use strict";

import * as operativos from "operativos";
import {AppOperativos} from "operativos";

import {ProceduresProcesamiento} from "./procedures-procesamiento";

export type Constructor<T> = new(...args: any[]) => T;
export function emergeAppProcesamiento<T extends Constructor<InstanceType<typeof AppOperativos>>>(Base:T){
    
    return class AppProcesamiento extends Base{
        constructor(...args:any[]){ 
            super(...args);
        }
        getProcedures(){
            //TODO: es igual que en datos-ext llevarlo a operativos
            var be = this;
            return super.getProcedures().then(function(procedures){
                return procedures.concat(
                    ProceduresProcesamiento.map(be.procedureDefCompleter, be)
                );
            });
        }    
        // clientIncludes(req:operativos.Request, hideBEPlusInclusions:boolean){
        //     //TODO: es igual que en datos-ext llevarlo a operativos
        //     return super.clientIncludes(req, hideBEPlusInclusions).concat([
        //         {type:'js' , src:'client/procesamiento.js'},
        //     ])
        // }
        getMenu():operativos.MenuDefinition{
            //TODO: es igual que en datos-ext llevarlo a operativos
            let myMenuPart:operativos.MenuInfo[]=[
                // {menuType:'table', name:'grupo_personas'}, // GENERAR DINAMICAMENTE A PARTIR DE UA
            ];
            let menu = {menu: super.getMenu().menu.concat(myMenuPart)}
            return menu;
        }
        prepareGetTables(){
            //TODO: es igual que en datos-ext llevarlo a operativos
            super.prepareGetTables();
            this.getTableDefinition={
                ...this.getTableDefinition,
                // grupo_personas // GENERAR DINAMICAMENTE A PARTIR DE UA
            }
        }
    }
}