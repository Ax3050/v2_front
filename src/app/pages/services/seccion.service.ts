import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SeccionService {

  constructor(private http: HttpClient) { }
  private url: string = environment.serverUrl;


  getSecciones(): Observable<any> {
    return this.http.get(`${this.url}/seccion`)
  }


  search(search): Observable<any> {
    return this.http.post(`${this.url}/seccion/search`, search)
  }

  getSeccionesById(id:number,idTrayecto:number): Observable<any> {
    return this.http.get(`${this.url}/seccion/${id}/${idTrayecto}`)
  }

  storeSeccion(data:any): Observable<any> {
    return this.http.post(`${this.url}/seccion`, data)
  }

  updateSeccion(id:number,data:any): Observable<any> {
    return this.http.patch(`${this.url}/seccion/${id}`, data)
  }

  deleteSeccion(id:number): Observable<any> {
    return this.http.delete(`${this.url}/seccion/${id}`)
  }
}
