import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { SeccionService } from 'src/app/pages/services/seccion.service';
import { PnfService } from 'src/app/pages/services/pnf.service';
import { TrayectoService } from '../../services/trayecto.service';
import { Subject, debounceTime } from 'rxjs';
import { AcademicYearService } from '../../services/academic-year.service';
@Component({
  selector: 'app-seccion',
  templateUrl: './seccion.component.html',
  styleUrls: ['./seccion.component.scss']
})
export class SeccionComponent implements OnInit, AfterViewInit{

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private pnfService:PnfService,
    private seccionService: SeccionService,
    private trayectoServices:TrayectoService,
    private academicYearService: AcademicYearService
  ){
  }
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;
  private inputSubject = new Subject<string>();


  ngOnInit(): void {
    this.getSecciones()
    this.getPnf()
    this.getAcademicYear()
    // this.getTrayectos()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = "";

    this.form.get('pnfId').valueChanges.subscribe(e=>{

      if(e){
        this.trayectos = this.pnfs.data.find((pnf:any) => pnf.id == e).trayectos;
      }else{
        this.trayectos = [];
        this.form.get('trayectoId').reset()
      }
    })

    this.inputSubject.pipe(debounceTime(500)).subscribe((e) => {
      console.log(e)
      this.search = {...this.search, search:e}
      this.searchSeccion()

    });
  }

  form = this.formBuilder.group({
    pnfId: [null, Validators.required],
    trayectoId: [null, Validators.required],
    academicYearId: [null, Validators.required],
    name: [null, Validators.required],
  })

  status:any = null;

  displayedColumns: string[] = ['PNF', 'Trayecto', 'Seccion','AcademicYear', 'Opt.'];
  pnfs:any=[];
  trayectos:any=[];
  secciones:any=[];
  academicYears:any=[];
  modalActive: any;
  edit:boolean = false;
  idEdit:number=0;
  loading:boolean = false;
  error:string = '';
  search:any={
    search: "",
    pnf:null
  };

  onInputChange(value: any) {
    this.inputSubject.next(value.target.value);
  }

  getPnf(){
    this.pnfService.getPnf()
    .subscribe(e=>{
      this.pnfs = e;
      console.log(e)
    })
  }
  getAcademicYear(){
    this.academicYearService.getAcademicYear()
    .subscribe(e=>{
      this.academicYears = e;
      console.log(e)
    })
  }
  // getTrayectos(){
  //   this.trayectoServices.getTrayecto()
  //   .subscribe(e=>{
  //     this.trayectos = e;
  //     console.log(e)
  //   })
  // }

  getSecciones(){
    this.seccionService.getSecciones()
    .subscribe(e=>{
      this.secciones = e
    })
  }

  store(){
    this.error = ''
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.seccionService.storeSeccion(this.form.value)
    .subscribe({
      next: (e)=>{
        this.getSecciones()
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
    console.log(this.form.value)

    this.seccionService.updateSeccion(this.idEdit,this.form.value)
    .subscribe({
      next: (e)=>{
        this.getSecciones()
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
    this.seccionService.deleteSeccion(id)
    .subscribe(e=>{
      this.getSecciones()
      this.successDeleteSwal.fire()
    })
  }

  changePnf(data:any){
    console.log(data)
    this.search = {...this.search,pnf:data};
    this.searchSeccion()
  }

  searchSeccion() {
    this.loading = true;

    this.seccionService.search(this.search)
      .subscribe(e => {
        console.log(e)
        this.loading = false;
        this.secciones = e
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
