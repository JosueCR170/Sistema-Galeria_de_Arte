import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { Matricula } from "../models/Matricula";
import { BehaviorSubject, Observable, tap } from "rxjs";


@Injectable({
    providedIn: 'root'
})

export class MatriculaService{
    private urlAPI:string;
    private matriSubject = new BehaviorSubject<any>(null);
    public matri$ = this.matriSubject.asObservable();
    constructor(
        private _http:HttpClient
    ){
        this.urlAPI = server.url;
    }

    create(matri:Matricula):Observable<any>{
        let matriJson=JSON.stringify(matri);
        let params='data='+matriJson;
        let bearertoken = sessionStorage.getItem('token');
        let headers;
        if (bearertoken){
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearertoken);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        }
        let options={
            headers
        }
        return this._http.post(this.urlAPI+'matricula/store',params,options);
    }

    index():Observable<any>{
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
        return this._http.get(this.urlAPI+'matricula', options);
    }


    deleted(id:number):Observable<any>{
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
        return this._http.delete(`${this.urlAPI}matricula/${id}`, options);
    }

    update(matri:Matricula): Observable<any> {
        console.log(matri);
        let matriJson=JSON.stringify(matri);
        let id = matri.id;
        let params='data='+matriJson;
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
        return this._http.put(`${this.urlAPI}matricula/${id}`, params, options);
    }

}