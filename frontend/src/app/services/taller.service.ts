import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { Taller } from "../models/Taller";
import { BehaviorSubject, Observable, tap } from "rxjs";


@Injectable({
    providedIn: 'root'
})

export class TallerService{
    private urlAPI:string;
    private tallerSubject = new BehaviorSubject<any>(null);
    public taller$ = this.tallerSubject.asObservable();
    constructor(
        private _http:HttpClient
    ){
        this.urlAPI = server.url;
    }

    create(taller:Taller):Observable<any>{
        let tallerJson=JSON.stringify(taller);
        let params='data='+tallerJson;
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
        return this._http.post(this.urlAPI+'taller/store',params,options);
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
        return this._http.get(this.urlAPI+'taller', options);
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
        return this._http.delete(`${this.urlAPI}taller/${id}`, options);
    }
    

    update(taller:Taller): Observable<any> {
        //console.log(taller);
        let TallerJson=JSON.stringify(taller);
        let id = taller.id;
        let params='data='+TallerJson;
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
        return this._http.put(`${this.urlAPI}taller/${id}`, params, options);
    }

    getTalleresByArtist(artistId: number): Observable<any> {
        let headers;
        let bearertoken = sessionStorage.getItem('token');
        if (bearertoken) {
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearertoken);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        }
        let options = {
            headers
        };
        return this._http.get(`${this.urlAPI}taller/artist/${artistId}`, options);
    }
    

}