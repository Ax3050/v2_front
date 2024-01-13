import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PnfService {

  constructor(private http: HttpClient) { }
  private url: string = environment.serverUrl;


  getPnf(): Observable<any> {
    return this.http.get(`${this.url}/pnf`)
  }

  storePnf(data:any): Observable<any> {
    return this.http.post(`${this.url}/pnf`, data)
  }

  searchPnf(data:any): Observable<any> {
    return this.http.post(`${this.url}/pnf/search`, data)
  }


  updatePnf(id:number,data:any): Observable<any> {
    return this.http.patch(`${this.url}/pnf/${id}`, data)
  }

  deletePnf(id:number): Observable<any> {
    return this.http.delete(`${this.url}/pnf/${id}`)
  }
}
