"use strict";
import * as Varcal from "varcal";
// import * from "varcal";

var ProceduresProcesamiento = [
    {
        action: 'saludos/hola',
        parameters: [
            {name:'operativo'     ,references:'operativos',  typeName:'text'},
        ],
        coreFunction: async function(context:Varcal.ProcedureContext, parameters: Varcal.coreFunctionParameters){
            var sqlParams=[parameters.varcal] + context.username;
            return sqlParams;
        }
    },
];

export {ProceduresProcesamiento};