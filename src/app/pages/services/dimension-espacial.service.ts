import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DimensionEspacialService {

  constructor(private http: HttpClient) { }
  private url: string = environment.serverUrl;


  getDimensionEspacial(): Observable<any> {
    return this.http.get(`${this.url}/dimension-espacial`)
  }

  search(search): Observable<any> {
    return this.http.post(`${this.url}/dimension-espacial/search`, search)
  }

  getDimensionByParroquiaId(id:any): Observable<any> {
    return this.http.get(`${this.url}/dimension-espacial/parroquia/${id}`)
  }

  storeDimensionEspacial(data:any): Observable<any> {
    return this.http.post(`${this.url}/dimension-espacial`, data)
  }

  updateDimensionEspacial(id:number,data:any): Observable<any> {
    return this.http.patch(`${this.url}/dimension-espacial/${id}`, data)
  }

  deleteDimensionEspacial(id:number): Observable<any> {
    return this.http.delete(`${this.url}/dimension-espacial/${id}`)
  }
}
