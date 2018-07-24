"use strict";

import * as varcal from "varcal";
import {procedures} from "./procedures-procesamiento";

export type Constructor<T> = new(...args: any[]) => T;
export function emergeAppProcesamiento<T extends Constructor<varcal.VarCalType>>(Base:T){
    
    return class AppProcesamiento extends Base{
        myProcedures: varcal.ProcedureDef[] = procedures;

        constructor(...args:any[]){ 
            super(args);    
            this.initialize();
            this.allClientFileNames.push({type:'js', src: 'client/procesamiento.js' })
        }

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