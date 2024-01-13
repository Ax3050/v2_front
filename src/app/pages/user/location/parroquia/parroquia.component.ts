import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { LocationService } from 'src/app/pages/services/location.service';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-parroquia',
  templateUrl: './parroquia.component.html',
  styleUrls: ['./parroquia.component.scss']
})
export class ParroquiaComponent implements OnInit, AfterViewInit{

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private locationService:LocationService
  ){
  }
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;
  private inputSubject = new Subject<string>();


  ngOnInit(): void {
    this.getEstados()
    this.getParroquia()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""

    this.form.get('name')
    .valueChanges.subscribe(()=> this.error = '')

    this.form.get('estadoId')?.valueChanges.
    subscribe((e:any)=>{
      console.log(e)
      this.municipios=[];
      this.form.get('municipioId')?.reset()
      e && this.getMunicipiosById(e)
    })

    this.inputSubject.pipe(debounceTime(500)).subscribe((e) => {
      console.log(e)
      this.search = {...this.search, search:e}
      this.searchParroquia()
    });
  }

  form = this.formBuilder.group({
    estadoId: [null, Validators.required],
    municipioId: [null, Validators.required],
    name: ['', Validators.required],
  })

  displayedColumns: string[] = ['Estado', 'Municipio', 'Parroquia', 'Opt.'];
  estados:any=[];
  municipios:any=[];
  parroquias:any=[];
  modalActive: any;
  edit:boolean = false;
  idEdit:number=0;
  loading:boolean = false;
  error:string = '';
  search:any={
    search:"",
    estado_id:null,
    municipio_id:null
  };

  onInputChange(value: any) {
    this.inputSubject.next(value.target.value);
  }

  getEstados(){
    this.locationService.getEstados()
    .subscribe(e=>{
      this.estados = e;
      console.log(e)
    })
  }

  getMunicipiosById(id:number){
    this.locationService.getMunicipiosById(id)
    .subscribe(e=>{
      this.municipios = e
    })
  }

  getParroquia(){
    this.locationService.getParroquias()
    .subscribe(e=>{
      this.parroquias = e
    })
  }

  store(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    let data = this.form.value;
    delete data.estadoId;
    let name:string = this.form.get('name').value;
    this.form.get('name').setValue(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())

    this.locationService.storeParroquia(data)
    .subscribe({
      next: (e)=>{
        this.getParroquia()
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
    let data = this.form.value;
    delete data.estadoId;
    this.locationService.updateParroquia(this.idEdit,data)
    .subscribe({
      next: (e)=>{
        this.getParroquia()
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
    this.locationService.deleteParroquia(id)
    .subscribe(e=>{
      this.getParroquia()
      this.successDeleteSwal.fire()
    })
  }

  changeEstado(data:any){
    this.search = {...this.search,estado_id:data, municipio_id:null};
    if(!data){
      this.municipios.data = null
    }else{
      this.getMunicipiosById(data)
    }
    this.searchParroquia()
  }

  changeMunicipio(data:any){
    this.search = {...this.search,municipio_id:data};
    this.searchParroquia()
  }

  searchParroquia() {
    this.loading = true;

    this.locationService.searchParroquia(this.search)
      .subscribe(e => {
        console.log(e)
        this.loading = false;
        this.parroquias = e.data
      })
  }

  setEdit(data:any){
    this.form.get('estadoId')?.setValue(data?.municipio?.estadoId)
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
