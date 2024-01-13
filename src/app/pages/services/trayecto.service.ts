import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrayectoService {

  constructor(private http: HttpClient) { }
  private url: string = environment.serverUrl;

  getTrayecto(): Observable<any> {
    return this.http.get(`${this.url}/trayecto`)
  }

  storeTrayecto(data:any): Observable<any> {
    return this.http.post(`${this.url}/trayecto`, data)
  }

  updateTrayecto(id:number,data:any): Observable<any> {
    return this.http.patch(`${this.url}/trayecto/${id}`, data)
  }

  deleteTrayecto(id:number): Observable<any> {
    return this.http.delete(`${this.url}/trayecto/${id}`)
  }

}
