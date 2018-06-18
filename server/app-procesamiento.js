"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const procedures_procesamiento_1 = require("./procedures-procesamiento");
function emergeAppProcesamiento(Base) {
    return class AppProcesamiento extends Base {
        constructor(...args) {
            super(...args);
        }
        getProcedures() {
            //TODO: es igual que en datos-ext llevarlo a varcal
            var be = this;
            return super.getProcedures().then(function (procedures) {
                return procedures.concat(procedures_procesamiento_1.ProceduresProcesamiento.map(be.procedureDefCompleter, be));
            });
        }
        // clientIncludes(req:varcal.Request, hideBEPlusInclusions:boolean){
        //     //TODO: es igual que en datos-ext llevarlo a varcal
        //     return super.clientIncludes(req, hideBEPlusInclusions).concat([
        //         {type:'js' , src:'client/procesamiento.js'},
        //     ])
        // }
        getMenu() {
            //TODO: es igual que en datos-ext llevarlo a varcal
            let myMenuPart = [
            // {menuType:'table', name:'grupo_personas'}, // GENERAR DINAMICAMENTE A PARTIR DE UA
            ];
            let menu = { menu: super.getMenu().menu.concat(myMenuPart) };
            return menu;
        }
        prepareGetTables() {
            //TODO: es igual que en datos-ext llevarlo a varcal
            super.prepareGetTables();
            this.getTableDefinition = Object.assign({}, this.getTableDefinition);
        }
    };
}
exports.emergeAppProcesamiento = emergeAppProcesamiento;
//# sourceMappingURL=app-procesamiento.js.map