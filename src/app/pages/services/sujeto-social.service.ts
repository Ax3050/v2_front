import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SujetoSocialService {

  constructor(private http: HttpClient) { }
  private url: string = environment.serverUrl;


  getSujetoSocial(): Observable<any> {
    return this.http.get(`${this.url}/sujeto-social`)
  }

  getSujetoSocialById(id:number): Observable<any> {
    return this.http.get(`${this.url}/sujeto-social/find/${id}`)
  }

  storeSujetoSocial(data:any): Observable<any> {
    return this.http.post(`${this.url}/sujeto-social`, data)
  }

  updateSujetoSocial(id:number,data:any): Observable<any> {
    return this.http.patch(`${this.url}/sujeto-social/${id}`, data)
  }

  deleteSujetoSocialo(id:number): Observable<any> {
    return this.http.delete(`${this.url}/sujeto-social/${id}`)
  }

}
