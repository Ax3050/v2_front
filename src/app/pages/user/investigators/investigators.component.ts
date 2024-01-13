import { Component, TemplateRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvestigatorService } from '../../services/investigator.service';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PnfService } from '../../services/pnf.service';
import { TrayectoService } from '../../services/trayecto.service';
import { SeccionService } from '../../services/seccion.service';
import { AcademicYearService } from '../../services/academic-year.service';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-investigators',
  templateUrl: './investigators.component.html',
  styleUrls: ['./investigators.component.scss']
})
export class InvestigatorsComponent implements OnInit, AfterViewInit {

  constructor(
    private dialog: MatDialog,
    private investigatorService: InvestigatorService,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private pnfServices:PnfService,
    private trayectoServices:TrayectoService,
    private seccionService: SeccionService,
    private academicYearService: AcademicYearService,
  ){
  }

  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;
  private inputSubject = new Subject<string>();

  ngOnInit(): void {
    this.getInvestigators()
    this.getPnfs()
    // this.getTrayectos()
    this.getAcademicYear()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""

    this.form.get('pnfId').valueChanges.subscribe(e=>{
      if (e) {
        this.trayectos = this.pnfs.data.find((pnf: any) => pnf.id == e)?.trayectos
      } else {
        this.trayectos = [];
      }
      this.form.get('trayectoId').reset()
    })

    this.form.get('trayectoId').valueChanges.subscribe(e=>{
      e ? this.getSecciones() : this.secciones = [];
      this.form.get('seccionId').reset()
      console.log(e)
    })

    this.inputSubject.pipe(debounceTime(500)).subscribe((e) => {
      console.log(e)
      this.searchInvestigator({search: e })

    });
  }

  displayedColumns: string[] = ['Nombres', 'Apellidos', 'Cedula', 'Expediente', 'Usuario', 'Opt.'];
  investigators:any = [];
  trayectos:any=[];
  secciones:any=[];
  pnfs:any=[];
  academicYears:any =[];

  form = this.formBuilder.group({
    exp: [null],
    trayectoId: [null, Validators.required],
    pnfId: [null, Validators.required],
    seccionId: [null, Validators.required],
    academicYearId: [null, Validators.required],
    people:this.formBuilder.group({
      name: [null, Validators.required],
      lastname: [null, Validators.required],
      nationality: [1],
      cedula: [null, [Validators.required, Validators.minLength(7)]],
    })
  })
  modalActive: any;
  loading:boolean = false;
  error:string = '';
  edit:boolean = false;
  idEdit:number=0;

  getInvestigators(){
    this.investigators = []
    this.investigatorService.getInvestigators()
    .subscribe(res=>{
      this.investigators = res;
      console.log('user', res)
    })
  }

  getPnfs(){
    this.pnfServices.getPnf()
    .subscribe(e=>{
      this.pnfs = e;
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

  getAcademicYear(){
    this.academicYearService.getAcademicYear()
    .subscribe(e=>{
      this.academicYears = e;
      console.log(e)
    })
  }

  getSecciones(){

    this.seccionService.getSeccionesById(this.getFieldValue('pnfId'),this.getFieldValue('trayectoId'))
    .subscribe(e=>{
      this.secciones = e
    })
  }

  paginate(event:any){
    console.log(event)
  }

  store(){
    this.error = ''

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    let formData:any = this.form.value;
    !formData.exp && delete formData.exp;
    formData.people.cedula.length == 7 && (formData.people.cedula = `0${formData.people.cedula}`);
    formData.people.nationality = parseInt(formData.people.nationality)
    this.loading = true;
    this.investigatorService.storeInvestigators(formData)
    .subscribe({
      next: (e)=>{
        this.getInvestigators()
        this.modalActive.close()
        this.loading = false;
        this.SuccessRegisterSwal.fire()
      },
      error: ({error:{error}}) => {
        console.log(error)

        this.loading = false;
        this.error = error.mensaje;
      }
    })

  }

  remove(id:number){
    this.investigatorService.deleteInvestigator(id)
    .subscribe(e=>{
      this.getInvestigators()
      this.successDeleteSwal.fire()
    })
  }

  update(){
    this.error = ''

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let formData:any = this.form.value;
    !formData.exp && delete formData.exp;
    formData.people.cedula.length == 7 && (formData.people.cedula = `0${formData.people.cedula}`);
    formData.people.nationality = parseInt(formData.people.nationality)
    this.loading = true;

    this.investigatorService.updateInvestigator(this.idEdit,formData)
    .subscribe({
      next: (e)=>{
        this.getInvestigators()
        this.modalActive.close()
        this.loading = false;
        this.SuccessUpdateSwal.fire()
      },
      error: ({error:{error}}) => {
        this.loading = false;
        this.error = error.mensaje;
      }
    })
  }

  setEdit(data:any){
    this.form.patchValue(data)
    this.form.get('trayectoId').setValue(data.trayectoId)
    this.form.get('seccionId').setValue(data.seccionId)
    this.getSecciones()
    this.idEdit = data?.id;
    this.edit = true;
    this.openModal()
  }

  searchInvestigator(data) {
    this.loading = true;

    this.investigatorService.search(data)
      .subscribe(e => {
        console.log(e)
        this.loading = false;
        this.investigators = e
      })
  }

  onInputChange(value: any) {
    this.inputSubject.next(value.target.value);
  }

  getFieldInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched
  }

  getField(field:string){
    return this.form.get(field)
  }

  getFieldValue(field:string){
    return this.form.get(field).value;
  }

  openModal(){
    this.error = null;
    this.modalActive = this.dialog.open(this.modal,
      {
        maxWidth: '800px',
        maxHeight: 'max-content',
        height: 'max-content',
        width: '100%',
        panelClass: 'full-screen-modal'
      })
    this.modalActive.afterClosed().subscribe(()=>{
      this.edit = false;
      this.form.reset({people:{nationality:1}})
    })
  }
}
