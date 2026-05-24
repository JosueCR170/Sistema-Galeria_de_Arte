import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { User } from "../models/user";
import { BehaviorSubject, Observable, tap } from "rxjs";


@Injectable({
    providedIn: 'root'
})

export class UserService{
    private urlAPI:string;
    private userSubject = new BehaviorSubject<any>(null);
    public user$ = this.userSubject.asObservable();
    constructor(
        private _http:HttpClient
    ){
        this.urlAPI = server.url;
    }

    login(user:User):Observable<any>{
        let userJson = JSON.stringify(user);
        let params = 'data='+userJson;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let options = {
            headers
        };
        return this._http.post(this.urlAPI+'user/login', params, options);
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

        return this._http.get(this.urlAPI+'user/getidentity', options);
    }

    getIdentityFromStorage(){
        let identity=sessionStorage.getItem('identity')
        if(identity){
            
            return JSON.parse(identity)
        }
        return null
    }

    create(user:User):Observable<any>{
        let userJson=JSON.stringify(user);
        let params='data='+userJson;
        let headers=new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        let options={
            headers
        }
        return this._http.post(this.urlAPI+'user/store',params,options);
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
        return this._http.get(this.urlAPI+'user', options);
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
        return this._http.delete(`${this.urlAPI}user/${id}`, options);
    }

    update(user:User): Observable<any> {
        console.log(user);
        let userJson=JSON.stringify(user);
        let id = user.id;
        //let formData = new FormData();
        let params='data='+userJson;
        let headers;
        let bearertoken = sessionStorage.getItem('token');
        
        //formData.append('_method', 'PUT');
        //formData.append('data', JSON.stringify(user));
        if (bearertoken){
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearertoken);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        }
        let options = {
            headers
        };
        return this._http.put(`${this.urlAPI}user/${id}`, params, options);
    }

    verifyToken(): Observable<any> {
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
    
        return this._http.get(this.urlAPI + 'verifyToken', options);
      }

}