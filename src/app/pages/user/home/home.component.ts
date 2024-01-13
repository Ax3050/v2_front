import { Component, OnInit } from '@angular/core';
import {BulkImportService} from '../../services/bulk-import.service'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  role:any = null;
  file:any=null;
  file_name=null;

  ngOnInit(): void {
    this.role = JSON.parse(localStorage.getItem('user') || '')?.role
  }

}
