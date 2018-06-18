/// <reference path="../../varcal/node_modules/types.d.ts/modules/pg-promise-strict/index.d.ts" />
/// <reference path="../node_modules/types.d.ts/modules/pg-promise-strict/index.d.ts" />
/// <reference path="../../datos-ext/node_modules/types.d.ts/modules/pg-promise-strict/index.d.ts" />
import * as varcal from "varcal";
import { AppVarCal } from "varcal";
export declare type Constructor<T> = new (...args: any[]) => T;
export declare function emergeAppProcesamiento<T extends Constructor<InstanceType<typeof AppVarCal>>>(Base: T): {
    new (...args: any[]): {
        getProcedures(): Promise<varcal.ProcedureDef[]>;
        getMenu(): varcal.MenuDefinition;
        prepareGetTables(): void;
        clientIncludes: ((req: varcal.Request, hideBEPlusInclusions: boolean) => varcal.ClientModuleDefinition[]) & ((req: varcal.Request, hideBEPlusInclusions?: boolean) => varcal.ClientModuleDefinition[]);
        getTableDefinition: varcal.TableDefinitionsGetters;
        appendToTableDefinition: (tableName: string, appenderFunction: (tableDef: varcal.TableDefinition, context?: varcal.TableContext) => void) => void;
        getTables: () => varcal.TableItemDef[];
        procedures: varcal.ProcedureDef[];
        procedure: {
            [key: string]: varcal.ProcedureDef;
        } & {
            [key: string]: varcal.ProcedureDef;
        } & {
            [key: string]: varcal.ProcedureDef;
        } & {
            [key: string]: varcal.ProcedureDef;
        };
        app: varcal.ExpressPlus;
        tableStructures: varcal.TableDefinitions;
        db: typeof import("pg-promise-strict");
        config: any;
        start: () => Promise<void>;
        getContext: (req: varcal.Request) => varcal.Context;
        addSchrödingerServices: (mainApp: varcal.ExpressPlus, baseUrl: string) => void;
        addLoggedServices: () => void;
        inDbClient: <T_1>(req: varcal.Request, doThisWithDbClient: (client: import("pg-promise-strict").Client) => Promise<T_1>) => Promise<T_1>;
        inTransaction: <T_1>(req: varcal.Request, doThisWithDbTransaction: (client: import("pg-promise-strict").Client) => Promise<T_1>) => Promise<T_1>;
        procedureDefCompleter: (procedureDef: varcal.ProcedureDef) => varcal.ProcedureDef;
        tableDefAdapt: (tableDef: varcal.TableDefinition, context: varcal.Context) => varcal.TableDefinition;
        pushApp: (dirname: string) => void;
        dumpDbSchemaPartial: (partialTableStructures: varcal.TableDefinitions, opts?: {
            complete?: boolean;
            skipEnance?: boolean;
        }) => Promise<{
            mainSql: string;
            enancePart: string;
        }>;
        getContextForDump: () => varcal.ContextForDump;
        getClientSetupForSendToFrontEnd: (req: varcal.Request) => varcal.ClientSetup;
    };
} & T;
