import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { TrayectoService } from 'src/app/pages/services/trayecto.service';



@Component({
  selector: 'app-trayecto',
  templateUrl: './trayecto.component.html',
  styleUrls: ['./trayecto.component.scss']
})
export class TrayectoComponent  implements OnInit, AfterViewInit{
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private trayectoServices:TrayectoService
  ){
  }
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;

  ngOnInit(): void {
    this.getPnfs()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""

    this.form.get('name')
    .valueChanges.subscribe(()=> this.error = '')
  }

  form = this.formBuilder.group({
    name: ['', Validators.required],
  })

  displayedColumns: string[] = ['Nombre', 'Opt.'];
  trayectos:any=[];
  modalActive: any;
  edit:boolean = false;
  idEdit:number=0;
  loading:boolean = false;
  error:string = '';


  getPnfs(){
    this.trayectoServices.getTrayecto()
    .subscribe(e=>{
      this.trayectos = e;
      console.log(e)
    })
  }

  store(){
    this.error = ''
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.form.get('name').setValue(this.form.value.name.toUpperCase())
    this.trayectoServices.storeTrayecto(this.form.value)
    .subscribe({
      next: (e)=>{
        this.getPnfs()
        this.modalActive.close()
        this.loading = false;
        this.SuccessRegisterSwal.fire()
      },
      error: ({error}) => {
        this.error = error.message
        this.loading = false;
      }
    })
  }


  update(){

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.trayectoServices.updateTrayecto(this.idEdit,this.form.value)
    .subscribe({
      next: (e)=>{
        this.getPnfs()
        this.modalActive.close()
        this.loading = false;
        this.SuccessUpdateSwal.fire()
      },
      error: (error) => {
        this.loading = false;
      }
    })
  }

  remove(id:number){
    this.trayectoServices.deleteTrayecto(id)
    .subscribe(e=>{
      this.getPnfs()
      this.successDeleteSwal.fire()
    })
  }

  setEdit(data:any){
    this.form.patchValue(data)
    this.idEdit = data?.id;
    this.edit = true;
    this.openModal()
  }

  paginate(event:any){
    console.log(event)
  }

  getFieldInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched
  }

  openModal(){
    this.modalActive = this.dialog.open(this.modal,
      {
        maxWidth: '500px',
        maxHeight: 'max-content',
        height: 'max-content',
        width: '100%',
        panelClass: 'full-screen-modal'
      })
    this.modalActive.afterClosed().subscribe(()=>{
      this.edit = false;
      this.form.reset()
    })
  }
}
