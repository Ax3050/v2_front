import { Component, OnInit, ViewChild } from '@angular/core';
import { BulkImportService } from '../../services/bulk-import.service';
import { ActivatedRoute } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-bulk-import',
  templateUrl: './bulk-import.component.html',
  styleUrls: ['./bulk-import.component.scss']
})
export class BulkImportComponent implements OnInit{

  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;

  constructor(
    private bulkImportService:BulkImportService,
    private activeRoute:ActivatedRoute
  ){}

  ngOnInit(): void {
    this.activeRoute.queryParams
    .subscribe((e:any)=>{
      console.log(e)
      this.type = parseInt(e?.type)
    })
  }

  file:any=null;
  file_name=null;
  type:number = 1;
  error = null;
  loading:boolean=false;

  selectFile(fileInput: HTMLInputElement){
    fileInput.click();
    fileInput.value = ''
    console.log(fileInput.files)
  }

  addFile(event: any) {
    this.file = event.target.files[0];
    this.file_name = this.file.name
    event.target.files = null;
    this.sendExcel()

    const teacher = [{
      id: ['50', '51', '52', '53'],
      name: ['jesus', 'gibson', 'alexander', 'juan'],
      lastname: ['gonzalez','castillo','torres', 'perez'],
      nationality:['1','1','1','1'] ,
      cedula:['19955455','20456877','07555195','02345543'],
      pnf_id:['5','6','6','5'],
      trayecto_id:['10','11','10','11']
    
    }]
    
    const persona = teacher.map((e) => ({
      id: e.id,
      name: e.name,
      lastname: e.lastname,
      nationality: e.nationality,
      cedula: e.cedula,
    }));
    
    localStorage.setItem('hola', JSON.stringify(teacher))
  }

  sendExcel(){
    this.error = null
    this.loading = true;
    let formData = new FormData();
    formData.append('file', this.file);
    this.bulkImportService.importExcel(formData)
    .subscribe({
      next:(e:any)=>{
        console.log(e)
        this.loading = false;
        this.SuccessRegisterSwal.fire()
      },
      error:({error})=>{
        this.error = error.message
        console.log(error)
        this.loading = false;
      },
    })
  }
}
