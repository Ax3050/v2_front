import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }
  private url: string = environment.serverUrl;

  // ? ESTADOS ##############################################
  getEstados(): Observable<any> {
    return this.http.get(`${this.url}/estado`)
  }

  searchEstados(search): Observable<any> {
    return this.http.post(`${this.url}/estado/search`,search)
  }

  storeEstado(data:any): Observable<any> {
    return this.http.post(`${this.url}/estado`, data)
  }

  updateEstado(id:number,data:any): Observable<any> {
    return this.http.patch(`${this.url}/estado/${id}`, data)
  }

  deleteEstado(id:number): Observable<any> {
    return this.http.delete(`${this.url}/estado/${id}`)
  }

  // ? MUNICIPIOS ##############################################

  getMunicipios(): Observable<any> {
    return this.http.get(`${this.url}/municipio`)
  }

  searchMunicipio(search): Observable<any> {
    return this.http.post(`${this.url}/municipio/search`,search)
  }

  getMunicipiosById(id:number): Observable<any> {
    return this.http.get(`${this.url}/municipio/${id}`)
  }

  storeMunicipio(data:any): Observable<any> {
    return this.http.post(`${this.url}/municipio`, data)
  }

  updateMunicipio(id:number,data:any): Observable<any> {
    return this.http.patch(`${this.url}/municipio/${id}`, data)
  }

  deleteMunicipio(id:number): Observable<any> {
    return this.http.delete(`${this.url}/municipio/${id}`)
  }


  // ? PARROQUIA ##############################################

  getParroquias(): Observable<any> {
    return this.http.get(`${this.url}/parroquia`)
  }

  searchParroquia(search): Observable<any> {
    return this.http.post(`${this.url}/parroquia/search`,search)
  }

  getParroquiasById(id:number): Observable<any> {
    return this.http.get(`${this.url}/parroquia/${id}`)
  }

  storeParroquia(data:any): Observable<any> {
    return this.http.post(`${this.url}/parroquia`, data)
  }

  updateParroquia(id:number,data:any): Observable<any> {
    return this.http.patch(`${this.url}/parroquia/${id}`, data)
  }

  deleteParroquia(id:number): Observable<any> {
    return this.http.delete(`${this.url}/parroquia/${id}`)
  }

}
