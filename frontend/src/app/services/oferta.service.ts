import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { Oferta } from "../models/Oferta";
import { BehaviorSubject, Observable, tap } from "rxjs";


@Injectable({
    providedIn: 'root'
})

export class OfertaService{

    private urlAPI:string;
    private OfferSubject = new BehaviorSubject<any>(null);
    public matri$ = this.OfferSubject.asObservable();
    constructor(
        private _http:HttpClient
    ){
        this.urlAPI = server.url;
    }

    create(oferta:Oferta):Observable<any>{
        let ofertaJson=JSON.stringify(oferta);
        let params='data='+ofertaJson;
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
        return this._http.post(this.urlAPI+'oferta/store',params,options);
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
        return this._http.get(this.urlAPI+'oferta', options);
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
        return this._http.delete(`${this.urlAPI}oferta/${id}`, options);
    }

    update(oferta:Oferta): Observable<any> {
        console.log(oferta);
        let ofertaJson=JSON.stringify(oferta);
        let id = oferta.id;
        let params='data='+ofertaJson;
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
        return this._http.put(`${this.urlAPI}oferta/${id}`, params, options);
    }


    indexFiltrado(): Observable<any> {
        let headers;
        let bearertoken = sessionStorage.getItem('token');
        if (bearertoken) {
            headers = new HttpHeaders().set('Content-Type', 'application/json').set('bearertoken', bearertoken);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/json');
        }
    
        return this._http.get(`${this.urlAPI}ofertas/artista`, { headers });
    }
    
 

}