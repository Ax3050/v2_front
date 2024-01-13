import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BulkImportService {

  constructor(private http: HttpClient) { }
  private url: string = environment.serverUrl;

  importExcel(data: any): Observable<any> {
    return this.http.post(`${this.url}/import_excel`, data)
  }
}
