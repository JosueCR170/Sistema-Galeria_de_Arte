import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { Artista } from "../models/Artista";
import { BehaviorSubject, Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ArtistService{
    private urlAPI:string;
    private artistSubject = new BehaviorSubject<any>(null);
    public artista$ = this.artistSubject.asObservable();
    constructor(
        private _http:HttpClient
    ){
        this.urlAPI = server.url;
    }

    index():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let options = {
            headers
        };
        return this._http.get(this.urlAPI+'artista', options);
    }

    loginArtist(artist:Artista):Observable<any>{
        let artistJSON = JSON.stringify(artist);
        let params = 'data='+artistJSON;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let options = {
            headers
        };
        return this._http.post(this.urlAPI+'artista/login', params, options);
    }

    getIdentityFromAPI():Observable<any>{
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
        return this._http.get(this.urlAPI+'artista/getidentity', options);
    }

    create(artista:Artista):Observable<any>{
        let artistaJson=JSON.stringify(artista);
        let params='data='+artistaJson;
        let headers=new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        let options={
            headers
        }
        return this._http.post(this.urlAPI+'artista/store',params,options);
    }

    showArtist(artistId: number): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let options = { headers };
        return this._http.get(`${this.urlAPI}artista/${artistId}`, options);
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
        return this._http.delete(`${this.urlAPI}artista/${id}`, options);
    }

    update(artista:Artista): Observable<any> {
        console.log(artista);
        let artistaJson=JSON.stringify(artista);
        let id = artista.id;
        //let formData = new FormData();
        let params='data='+artistaJson;
        let headers;
        let bearertoken = sessionStorage.getItem('token');
        
        //formData.append('_method', 'PUT');
        //formData.append('data', JSON.stringify(artista));
        if (bearertoken){
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearertoken);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        }
        let options = {
            headers
        };
        return this._http.put(`${this.urlAPI}artista/${id}`, params, options);
    }


}