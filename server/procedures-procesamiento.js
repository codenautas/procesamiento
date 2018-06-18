"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * from "varcal";
var ProceduresProcesamiento = [
    {
        action: 'saludos/hola',
        parameters: [
            { name: 'operativo', references: 'operativos', typeName: 'text' },
        ],
        coreFunction: async function (context, parameters) {
            var sqlParams = [parameters.varcal] + context.username;
            return sqlParams;
        }
    },
];
exports.ProceduresProcesamiento = ProceduresProcesamiento;
//# sourceMappingURL=procedures-procesamiento.js.map