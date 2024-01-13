import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { PnfService } from 'src/app/pages/services/pnf.service';
import { TrayectoService } from '../../services/trayecto.service';
import { Subject, debounceTime } from 'rxjs';


@Component({
  selector: 'app-pnf',
  templateUrl: './pnf.component.html',
  styleUrls: ['./pnf.component.scss']
})
export class PnfComponent implements OnInit, AfterViewInit{

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private pnfServices:PnfService,
    private trayectoServices:TrayectoService
  ){
  }
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;
  private inputSubject = new Subject<string>();

  ngOnInit(): void {
    this.getTrayectos()
    this.getPnfs()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""

    this.form.get('name')
    .valueChanges.subscribe(()=> this.error = '')

    this.inputSubject.pipe(debounceTime(500)).subscribe((e) => {
      console.log(e)
      this.searchPnf({ search: e })

    });
  }

  form = this.formBuilder.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    trayectos: [[], Validators.required],
  })

  displayedColumns: string[] = ['Codigo','Nombre', 'Trayectos', 'Opt.'];
  pnfs:any=[];
  trayectos:any=[];

  modalActive: any;
  edit:boolean = false;
  idEdit:number=0;
  loading:boolean = false;
  error:string = '';


  getPnfs(){
    this.pnfServices.getPnf()
    .subscribe(e=>{
      this.pnfs = e;
    })
  }

  getTrayectos(){
    this.trayectoServices.getTrayecto()
    .subscribe(e=>{
      this.trayectos = e.data;
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

    let name:string = this.form.get('name').value;
    this.form.get('name').setValue(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())

    const data:any = this.form.value;

    this.pnfServices.storePnf({...data,trayectos: data.trayectos.join()})
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
    this.error = ''

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const data:any = this.form.value;

    this.pnfServices.updatePnf(this.idEdit,{...data,trayectos: data.trayectos.join()})
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
    this.pnfServices.deletePnf(id)
    .subscribe(e=>{
      this.getPnfs()
      this.successDeleteSwal.fire()
    })
  }


  onInputChange(value: any) {
    this.inputSubject.next(value.target.value);
  }


  searchPnf(data) {
    this.loading = true;

    this.pnfServices.searchPnf(data)
      .subscribe(e => {
        console.log(e)
        this.loading = false;
        this.pnfs = e.data
      })
  }

  setEdit(data:any){

    this.form.patchValue({...data, trayectos: data.trayectos.map((trayecto:any)=> trayecto?.id)})
    console.log(this.form.value)
    this.idEdit = data?.id;
    this.edit = true;
    this.openModal()
  }

  getTrayectosString(data:any){
    return data.map((trayecto:any)=> trayecto?.name).join()
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
