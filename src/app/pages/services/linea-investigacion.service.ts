import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LineaInvestigacionService {

  constructor(private http: HttpClient) { }
  private url: string = environment.serverUrl;


  getLineaInvestigacion(): Observable<any> {
    return this.http.get(`${this.url}/linea-investigacion`)
  }

  search(search): Observable<any> {
    return this.http.post(`${this.url}/linea-investigacion/search`,search)
  }

  getLineaInvestigacionById(id:number): Observable<any> {
    return this.http.get(`${this.url}/linea-investigacion/find/${id}`)
  }

  storeLineaInvestigacion(data:any): Observable<any> {
    return this.http.post(`${this.url}/linea-investigacion`, data)
  }

  updateLineaInvestigacion(id:number,data:any): Observable<any> {
    return this.http.patch(`${this.url}/linea-investigacion/${id}`, data)
  }

  deleteLineaInvestigacion(id:number): Observable<any> {
    return this.http.delete(`${this.url}/linea-investigacion/${id}`)
  }
}
