import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, tap } from 'rxjs';
import { InvestigatorService } from '../../services/investigator.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private investigatorService:InvestigatorService
  ) { }
  private url: string = environment.serverUrl;

  login(data:any): Observable<any> {
    return this.http.post(`${this.url}/auth/login`,data)
    .pipe(
      tap((e)=>{
        if(e.user.role == 'student'){
          this.investigatorService.getStudentByPeopleId(e.user.peopleId)
          .subscribe(e=>{
            localStorage.setItem('investigator', JSON.stringify(e.investigator) )
            console.log(e)
          })
        }
      })
    )
  }

  signUp(data:any): Observable<any> {
    return this.http.post(`${this.url}/user`,data)
  }

  signUpInvestigator(data:any): Observable<any> {
    return this.http.post(`${this.url}/investigator/register`,data)
  }

  sendCode(data:any): Observable<any> {
    return this.http.post(`${this.url}/user/sendEmail`,data)
  }

  verifyCode(data:any): Observable<any> {
    return this.http.post(`${this.url}/user/verifyCode`,data)
  }

  changePassword(data:any): Observable<any> {
    return this.http.post(`${this.url}/user/changePassword`,data)
  }
}
