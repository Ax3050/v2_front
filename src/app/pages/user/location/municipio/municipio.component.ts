import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { LocationService } from 'src/app/pages/services/location.service';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-municipio',
  templateUrl: './municipio.component.html',
  styleUrls: ['./municipio.component.scss']
})
export class MunicipioComponent implements OnInit, AfterViewInit{

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
    this.getMunicipios()
    this.getEstados()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""
    this.form.get('name')
    .valueChanges.subscribe(()=> this.error = '')

    this.inputSubject.pipe(debounceTime(500)).subscribe((e) => {
      console.log(e)
      this.search = {...this.search, search:e}
      this.searchMunicipio()
    });
  }

  form = this.formBuilder.group({
    estadoId: [null, Validators.required],
    name: ['', Validators.required],
  })

  displayedColumns: string[] = ['Estado', 'Municipio', 'Opt.'];
  estados:any=[];
  municipios:any=[];
  modalActive: any;
  edit:boolean = false;
  idEdit:number=0;
  loading:boolean = false;
  error:string = '';
  search:any={
    search:"",
    estado_id:null
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

  getMunicipios(){
    this.locationService.getMunicipios()
    .subscribe(e=>{
      this.municipios = e
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

    this.locationService.storeMunicipio(this.form.value)
    .subscribe({
      next: (e)=>{
        this.getMunicipios()
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

    this.locationService.updateMunicipio(this.idEdit,this.form.value)
    .subscribe({
      next: (e)=>{
        this.getMunicipios()
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
    this.locationService.deleteMunicipio(id)
    .subscribe(e=>{
      this.getMunicipios()
      this.successDeleteSwal.fire()
    })
  }

  changeEstado(data:any){
    this.search = {...this.search,estado_id:data};
    this.searchMunicipio()
  }

  searchMunicipio() {
    this.loading = true;

    this.locationService.searchMunicipio(this.search)
      .subscribe(e => {
        console.log(e)
        this.loading = false;
        this.municipios = e.data
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
