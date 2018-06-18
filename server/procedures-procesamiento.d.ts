import * as Varcal from "varcal";
declare var ProceduresProcesamiento: {
    action: string;
    parameters: {
        name: string;
        references: string;
        typeName: string;
    }[];
    coreFunction: (context: Varcal.ProcedureContext, parameters: Varcal.coreFunctionParameters) => Promise<string>;
}[];
export { ProceduresProcesamiento };
