import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AreaPrioritariaService {


  constructor(private http: HttpClient) { }
  private url: string = environment.serverUrl;


  getAreaPrioritaria(): Observable<any> {
    return this.http.get(`${this.url}/area-prioritaria`)
  }

  search(search): Observable<any> {
    return this.http.post(`${this.url}/area-prioritaria/search`, search)
  }

  getAreaByPnf(id:any): Observable<any> {
    return this.http.get(`${this.url}/area-prioritaria/pnf/${id}`)
  }

  storeAreaPrioritaria(data:any): Observable<any> {
    return this.http.post(`${this.url}/area-prioritaria`, data)
  }

  updateAreaPrioritaria(id:number,data:any): Observable<any> {
    return this.http.patch(`${this.url}/area-prioritaria/${id}`, data)
  }

  deleteAreaPrioritaria(id:number): Observable<any> {
    return this.http.delete(`${this.url}/area-prioritaria/${id}`)
  }
}
