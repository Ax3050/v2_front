import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private http: HttpClient) { }
  private url: string = environment.serverUrl;


  storePeople(data:any): Observable<any> {
    return this.http.post(`${this.url}/people`, data)
  }

  update(id:number,data:any): Observable<any> {
    return this.http.patch(`${this.url}/people/${id}`, data)
  }

  updatePnf(id:number,data:any): Observable<any> {
    return this.http.patch(`${this.url}/pnf/${id}`, data)
  }

  delete(id:number): Observable<any> {
    return this.http.delete(`${this.url}/people/${id}`)
  }
}
