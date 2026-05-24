import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Envio } from "../models/Envio";

@Injectable({
    providedIn: 'root'
})

export class EnvioService{
    private urlAPI:string;
    constructor(
        private _http:HttpClient
    ){
        this.urlAPI = server.url;
    }


    create(envio:Envio):Observable<any>{
        let headers;
        let bearertoken = sessionStorage.getItem('token');
        let envioJson=JSON.stringify(envio);
        let params='data='+envioJson;

        if (bearertoken){
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearertoken);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        }
        let options = {
            headers
        };
        return this._http.post(this.urlAPI+'envio/store',params,options);
    }

    update(envio:Envio): Observable<any> {
        //console.log(envio);
        let obraJson=JSON.stringify(envio);
        let id = envio.id;
        //let formData = new FormData();
        let params='data='+obraJson;
        let headers;
        let bearertoken = sessionStorage.getItem('token');
        
        if (bearertoken){
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearertoken);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        }
        let options = {
            headers
        };
        return this._http.put(`${this.urlAPI}envio/${id}`, params, options);
    }

    indexByArtist():Observable<any>{
        let headers;
        let bearertoken = sessionStorage.getItem('token');
        if (bearertoken){
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearertoken);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        }
        let options = {
            headers
        };
        return this._http.get(this.urlAPI+'envio/artist', options);
    }

    getByUser(id: string): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let options = {
            headers
        };
        return this._http.get(`${this.urlAPI}envio/user/${id}`, options);
    }

}