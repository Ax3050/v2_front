import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(
    private router: Router
  ){
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '')
  }

  user:any=null;

  logOut(){
    localStorage.clear()
    this.router.navigate(['/'])
  }
}
