import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AcademicYearService {

  constructor(private http: HttpClient) { }
  private url: string = environment.serverUrl;


  getAcademicYear(): Observable<any> {
    return this.http.get(`${this.url}/academic-year`)
  }

  storeAcademicYear(data:any): Observable<any> {
    return this.http.post(`${this.url}/academic-year`, data)
  }

  updateAcademicYear(id:number,data:any): Observable<any> {
    return this.http.patch(`${this.url}/academic-year/${id}`, data)
  }

  deleteAcademicYear(id:number): Observable<any> {
    return this.http.delete(`${this.url}/academic-year/${id}`)
  }
}
