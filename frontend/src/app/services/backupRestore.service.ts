import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { BackupRestoreBD } from "../models/BackupRestoreBD";

@Injectable({
    providedIn: 'root'
})

export class backupRestoreService{
    private urlAPI:string;
    private backupRestoreSubject = new BehaviorSubject<any>(null);
    public backupRestore$ = this.backupRestoreSubject.asObservable();
    constructor(
        private _http:HttpClient
    ){
        this.urlAPI = server.url;
    }


    restoreBD(backupRestore:BackupRestoreBD): Observable<any> {
        console.log(backupRestore);
        let backupRestoreJson=JSON.stringify(backupRestore);
        let params='data='+backupRestoreJson;
        let bearertoken = sessionStorage.getItem('token');
        let headers;
        if (bearertoken){
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearertoken);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        }
        let options = {
            headers
        };
        return this._http.put(`${this.urlAPI}adminBD/restore`, params, options);
    }


    backupBD(): Observable<any> {
        let bearertoken = sessionStorage.getItem('token');
        let headers = new HttpHeaders().set('bearertoken', bearertoken || ''); // Solo incluye el token si existe
    
        // Definir las opciones con los encabezados
        let options = {
            headers,
            responseType: 'blob' as 'json' // Asegúrate de que el responseType esté configurado correctamente
        };
    
        return this._http.get(this.urlAPI + 'admin/backup', options);
    }
    
    


}