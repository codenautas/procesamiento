"use strict";

import {ProcedureContext, Context} from "backend-plus";
import * as Procesamiento from "procesamiento";
import * as fs from "fs-extra";
import * as likear from "like-ar";
import {VariablesOpciones} from "./types-datos-ext";
import { CompilerOptions } from "procesamiento";

type OrigenesGenerarParameters={
    operativo: string
    origen: string
}

//GENERALIZAR
const OPERATIVO='REPSIC';
const ESTRUCTURA_PARA_GENERAR:Procesamiento.DefinicionEstructural={
    aliases:{
        padre: {
            tabla: 'personas',
            where: 'padre.id_caso = personas.id_caso AND padre.p0 = personas.p11 AND padre.operativo = personas.operativo',
            join: 'operativo, id_caso'
        }
    },
    tables:{
        grupo_personas:{
            target:'grupo_personas_calc',
            sourceBro:'grupo_personas',
            sourceJoin:'',
            where:'grupo_personas.operativo = grupo_personas_calc.operativo and grupo_personas.id_caso = grupo_personas_calc.id_caso',
            aliasAgg: 'grupo_personas_agg',
            sourceAgg: 'grupo_personas_calc',
            whereAgg: '',
            detailTables: [
                {
                    table: 'personas_calc',
                    fields: ["operativo","id_caso"],
                    abr: "p"
                }
            ]
        },
        personas:{
            target:'personas_calc',
            sourceBro:'personas',
            sourceJoin:'inner join grupo_personas using (operativo, id_caso)',
            where:'personas.operativo = personas_calc.operativo and personas.id_caso = personas_calc.id_caso and personas.p0 = personas_calc.p0',
            aliasAgg: 'personas_agg',
            sourceAgg: 'personas_calc inner join personas using(operativo, id_caso, p0)',
            whereAgg: 'personas_calc.operativo = grupo_personas.operativo and personas_calc.id_caso = grupo_personas.id_caso'
        }
    }
}
//FIN GENERALIZAR
var ProceduresProcesamiento = [
    {   
        action:'calculadas/generar',
        parameters:[
            // {name:'operativo', typeName:'text', references:'operativos', }
        ],
        coreFunction:async function(context:ProcedureContext, parameters:OrigenesGenerarParameters){
            parameters.operativo=OPERATIVO;
            var be=context.be;
            var db=be.db;
            be.sanitizarExpSql = function(x){ 
                if(typeof x === 'string' && /"'/.test(x)){
                    console.log('caracteres invalidos en expresion');
                    console.log(x);
                    throw new Error("caracteres invalidos en expresion")
                }
                if(typeof x !== 'string' && typeof x !== 'number' ){
                    console.log('tipo invalidos en expresion');
                    console.log(x);
                    throw new Error("tipo invalidos en expresion")
                }
                return x;
            };
            /* -------------- ESTO SE HACE UNA SOLA VEZ AL CERRAR, PASAR A CERRAR CUANDO LO HAGAMOS ------ */
            await context.client.query(
                `DELETE FROM variables_opciones op
                    WHERE EXISTS 
                        (SELECT variable FROM variables v 
                            WHERE v.operativo=op.operativo and v.variable=op.variable 
                                and v.clase='relevamiento' and v.operativo=$1)`
                ,[parameters.operativo]
            ).execute();
            await context.client.query(
                `DELETE FROM repsic.variables WHERE operativo = $1 and clase = 'relevamiento'`,
                [parameters.operativo]
            ).execute();
            await context.client.query(`INSERT INTO repsic.variables(
                operativo, variable, unidad_analisis, tipovar, nombre,  activa, 
                clase, cerrada)
              select c1.operativo, var_name, c0.unidad_analisis, 
                case tipovar 
                  when 'si_no' then 'opciones' 
                  when 'si_no_nn' then 'opciones' 
                else tipovar end, 
                nombre, true, 
                'relevamiento', true
                from casilleros c1, lateral casilleros_recursivo(operativo, id_casillero),
                (select operativo, id_casillero, unidad_analisis from casilleros where operativo =$1 and tipoc='F') c0
                where c1.operativo =c0.operativo and ultimo_ancestro = c0.id_casillero and c1.tipovar is not null
                order by orden_total`,
                [parameters.operativo]
            ).execute();
            await context.client.query(`
                with pre as (
                    select c1.operativo, var_name, c0.unidad_analisis, tipovar, orden_total, c1.id_casillero
                        from casilleros c1, lateral casilleros_recursivo(operativo, id_casillero),
                            (select operativo, id_casillero,unidad_analisis from casilleros where operativo ='REPSIC' and tipoc='F') c0
                        where c1.operativo =c0.operativo and ultimo_ancestro = c0.id_casillero and c1.tipovar is not null
                        order by orden_total
                )
                INSERT INTO repsic.variables_opciones(
                        operativo, variable, opcion, nombre, orden)
                  select op.operativo, pre.var_name, casillero::integer,op.nombre, orden
                    from  pre join casilleros op on pre.operativo=op.operativo and pre.id_casillero=op.padre 
                    where pre.operativo=$1
                    order by orden_total, orden`
                , [parameters.operativo]               
            ).execute();    
            /* -------------- fin ESTO SE HACE UNA SOLA VEZ --------------------------------------------- */
            var drops:string[]=[];
            var creates:string[]=[];
            var inserts:string[]=[];
            var allPrefixedPks:{
                [key:string]:{
                    pks: string[],
                    pksString: string,
                }
            };
            var tableDefs={};
            var resTypeNameTipoVar= await context.client.query(`SELECT jsonb_object(array_agg(tipovar), array_agg(type_name)) 
                    FROM meta.tipovar                    
            `).fetchUniqueValue();
            var typeNameTipoVar=resTypeNameTipoVar.value;
            var resultUA = await context.client.query(`SELECT 
                   /* pk_padre debe ser el primer campo */
                   ${be.sqls.exprFieldUaPkPadre} as pk_padre, ua.*,
                   (select jsonb_agg(to_jsonb(v.*)) from variables v where v.operativo=ua.operativo and v.unidad_analisis=ua.unidad_analisis and v.clase='calculada' and v.activa) as variables
                FROM unidad_analisis ua
                WHERE operativo=$1
                ORDER BY 1
            `,[OPERATIVO]).fetchAll();
            resultUA.rows.forEach(function(row){
                var estParaGen = ESTRUCTURA_PARA_GENERAR.tables[row.unidad_analisis];
                var tableName=estParaGen.target;
                drops.unshift("drop table if exists "+db.quoteIdent(tableName) + ";");
                var broDef = be.tableStructures[estParaGen.sourceBro](be.getContextForDump())
                var primaryKey=row.pk_padre.concat(row.pk_agregada);
                primaryKey.unshift('operativo'); // GENE              
                var prefixedPks: string[] = primaryKey.map((pk:string) => row.unidad_analisis+'.'+pk);
                allPrefixedPks[row.unidad_analisis] = {
                    pks: prefixedPks,
                    pksString: prefixedPks.join(', ')
                }           
                var isAdmin = context.user.rol==='admin';
                var tableDefParteCtte={
                    name:tableName,
                    fields:broDef.fields.filter(field=>field.isPk).concat(
                        row.variables? (row.variables.map(v => {return {name:v.variable, typeName:typeNameTipoVar[v.tipovar], editable:false}}))
                        :[]
                    ),
                    editable:isAdmin,
                    primaryKey:primaryKey,
                    foreignKeys:[
                        {references:estParaGen.sourceBro, fields:primaryKey, onDelete:'cascade', displayAllFields:true}
                    ],
                    detailTables:estParaGen.detailTables,
                    sql:{
                        skipEnance:true,
                        isReferable: true
                    }
                }
                be.tableStructures[tableName]=tableDefs[tableName]=function(context: Context){
                    return context.be.tableDefAdapt(tableDefParteCtte,context);
                };
                var pkString=primaryKey.join(', ');
                inserts.push(
                    "INSERT INTO "+db.quoteIdent(tableName)+" ("+pkString+") "+
                    "SELECT "+pkString+" FROM "+estParaGen.sourceBro+ ' '+ estParaGen.sourceJoin+";"
                )
            });
            var sqls = await be.dumpDbSchemaPartial(tableDefs, {});
            creates=creates.concat(sqls.mainSql).concat(sqls.enancePart);
            var allSqls=drops.concat(creates).concat(inserts)
            // await context.client.executeSentences(allSqls);
            var variablesDatoResult = await context.client.query(`SELECT
               v.*, (
                      select jsonb_agg(to_jsonb(vo.*) order by vo.orden, vo.opcion) 
                        from variables_opciones vo 
                        where vo.operativo = v.operativo and vo.variable = v.variable) as opciones
               FROM variables v
               WHERE v.operativo = $1
                 AND v.clase = 'calculada'
                 AND v.activa
            `,[OPERATIVO]).fetchAll();
            function wrapExpression(expression: string, pkExpression:string){
                var opts:CompilerOptions={language:'sql', varWrapper:'null2zero', divWrapper:'div0err', elseWrapper:'lanzar_error'};
                return Procesamiento.getWrappedExpression(expression, pkExpression, opts);
            }
            var variablesACalcular = variablesDatoResult.rows.map(function(v){
                let expresionValidada;
                var pkList = allPrefixedPks[v.unidad_analisis].pksString;
                if(v.opciones && v.opciones.length){
                    expresionValidada='CASE '+v.opciones.map(function(opcion: VariablesOpciones){
                        return '\n  WHEN '+wrapExpression(opcion.expresion_condicion,pkList)+
                            ' THEN '+wrapExpression(opcion.expresion_valor||opcion.opcion.toString(),pkList)
                    }).join('')+(v.expresion?'\n  ELSE '+wrapExpression(v.expresion,pkList):'')+' END'
                }else{
                    expresionValidada = wrapExpression(v.expresion,pkList);
                }
                let insumos=Procesamiento.getInsumos(expresionValidada);
                return {
                    tabla:v.unidad_analisis, 
                    nombreVariable:v.variable, 
                    expresionValidada,
                    insumos,
                    funcion_agregacion: v.funcion_agregacion,
                    tabla_agregada: v.tabla_agregada
                }
            });
            var variablesDatoResult = await context.client.query(`
                SELECT variable, unidad_analisis, clase from variables
                WHERE operativo = $1 AND activa
            `,[OPERATIVO]).fetchAll();
            var allVariables:{
                [key:string]: {
                    tabla: string,
                    clase?: string
                }
            } = {};
            variablesDatoResult.rows.forEach(vDato=> allVariables[vDato.variable] = {tabla:vDato.unidad_analisis, clase: vDato.clase});
            likear(allPrefixedPks).forEach(function(prefixedPk, ua:string){
                prefixedPk.pks.forEach(pk => allVariables[pk] = {tabla:ua})
            });
            var grupoVariables=Procesamiento.separarEnGruposPorNivelYOrigen(variablesACalcular, Object.keys(likear(allVariables).filter(v=> v.clase != 'calculada')), ESTRUCTURA_PARA_GENERAR);
            var parametrosGeneracion = {
                nombreFuncionGeneradora:'gen_fun_procesamientoc',
                esquema: be.config.db.schema,
            };
            var funcionGeneradora = Procesamiento.funcionGeneradora(grupoVariables, parametrosGeneracion, ESTRUCTURA_PARA_GENERAR, allVariables);
            allSqls = ['do $SQL_DUMP$\n begin', "set search_path = "+be.config.db.schema+';'].concat(allSqls).concat(funcionGeneradora, 'perform gen_fun_procesamientoc();', 'end\n$SQL_DUMP$');
            let localMiroPorAhora = './local-miro-por-ahora.sql';
            var now=new Date();
            var todoElScript=allSqls.join('\n----\n')+'--- generado: '+now.toISOString()+'\n';
            fs.writeFileSync(localMiroPorAhora,todoElScript,{encoding:'utf8'})
            await context.client.query(todoElScript).execute();
            return 'generado !';
        }
    }
];

export {ProceduresProcesamiento};