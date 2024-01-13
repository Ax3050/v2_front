import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private http: HttpClient) { }
  private url: string = environment.serverUrl;

  findTeacherCi(cedula): Observable<any> {
    return this.http.get(`${this.url}/teacher/find/${cedula}`)
  }

  search(search): Observable<any> {
    return this.http.post(`${this.url}/teacher/search`, search)
  }

  getProjectsById(id:number): Observable<any> {
    return this.http.get(`${this.url}/teacher/get-projects/${id}`)
  }

  getTeachers(): Observable<any> {
    return this.http.get(`${this.url}/teacher`)
  }

  storeTeacher(data:any): Observable<any> {
    return this.http.post(`${this.url}/teacher`, data)
  }

  updateTeacher(data:any): Observable<any> {
    return this.http.patch(`${this.url}/teacher`, data)
  }

  deleteTeacher(data:any): Observable<any> {
    return this.http.post(`${this.url}/teacher/delete`, data)
  }
}
