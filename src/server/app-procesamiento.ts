"use strict";

import { AppBackend, AppConsistenciasType, emergeAppConsistencias, emergeAppOperativos } from "consistencias";
import * as varcal from "varcal";
export * from "./types-procesamiento";

export function emergeAppProcesamiento<T extends varcal.Constructor<AppConsistenciasType>>(Base:T){
    
    return class AppProcesamiento extends Base{
        constructor(...args:any[]){ 
            super(args);    
            // NO COMITEAR
            // this.allClientFileNames.push({type:'js', module: 'procesamiento', modPath: '../client', file: 'procesamiento.js', path: 'client_modules'})
            this.allClientFileNames.push({type:'js', src: 'client/procesamiento.js' })
        }

        configStaticConfig(){
            super.configStaticConfig();
            this.setStaticConfig(`
          server:
            port: 3034
            base-url: /procesamiento
            session-store: memory
          db:
            motor: postgresql
            host: localhost
            database: procesamiento_db
            schema: procesamiento
            user: procesamiento_user
            search_path: 
            - procesamiento
          install:
            dump:
              db:
                owner: procesamiento_owner
              admin-can-create-tables: true
              enances: inline
              skip-content: true
              scripts:
                post-adapt: 
                - para-install.sql
                - ../node_modules/datos-ext/install/controlar_modificacion_generada.sql
                - ../node_modules/varcal/install/wrappers.sql
                - ../node_modules/pg-triggers/lib/recreate-his.sql
                - ../node_modules/pg-triggers/lib/table-changes.sql
                - ../node_modules/pg-triggers/lib/function-changes-trg.sql
                - ../node_modules/pg-triggers/lib/enance.sql
          login:
            table: usuarios
            userFieldName: usuario
            passFieldName: md5clave
            rolFieldName: rol
            infoFieldList: [usuario, rol]
            activeClausule: activo
            plus:
              maxAge-5-sec: 5000    
              maxAge: 864000000
              maxAge-10-day: 864000000
              allowHttpLogin: true
              fileStore: false
              skipCheckAlreadyLoggedIn: true
              loginForm:
                formTitle: Procesamiento
                usernameLabel: usuario
                passwordLabel: md5clave
                buttonLabel: entrar
                formImg: img/login-lock-icon.png
              chPassForm:
                usernameLabel: usuario
                oldPasswordLabel: clave anterior
                newPasswordLabel: nueva clave
                repPasswordLabel: repetir nueva clave
                buttonLabel: Cambiar
                formTitle: Cambio de clave
            messages:
              userOrPassFail: el nombre de usuario no existe o la clave no corresponde
              lockedFail: el usuario se encuentra bloqueado
              inactiveFail: es usuario está marcado como inactivo
          client-setup:
            title: Procesamiento
            cursors: true
            lang: es
            menu: true
            `);
        }
    }
}

export var AppProcesamiento = emergeAppProcesamiento(emergeAppConsistencias(varcal.emergeAppVarCal(emergeAppOperativos(AppBackend))));
export type AppProcesamientoType = InstanceType<typeof AppProcesamiento>;