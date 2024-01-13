import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { LineaInvestigacionService } from '../../services/linea-investigacion.service';
import { AreaPrioritariaService } from '../../services/area-prioritaria.service';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-linea-investigacion',
  templateUrl: './linea-investigacion.component.html',
  styleUrls: ['./linea-investigacion.component.scss']
})
export class LineaInvestigacionComponent  implements OnInit, AfterViewInit{

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private lineaInvestigacionService:LineaInvestigacionService,
    private areaPrioritariaService:AreaPrioritariaService
  ){
  }
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;
  private inputSubject = new Subject<string>();

  ngOnInit(): void {
    this.getLienas()
    this.getAreas()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""

    this.form.get('name')
    .valueChanges.subscribe(()=> this.error = '')

    this.inputSubject.pipe(debounceTime(500)).subscribe((e) => {
      console.log(e)
      this.search = {...this.search, search:e}
      this.searchLinea()

    });
  }

  form = this.formBuilder.group({
    name: ['', Validators.required],
    AreaPrioritariaId: [null, Validators.required],
  })

  displayedColumns: string[] = ['AreaPrioritaria','Nombre', 'Opt.'];
  lineas:any=[];
  areas:any=[];
  modalActive: any;
  edit:boolean = false;
  idEdit:number=0;
  loading:boolean = false;
  error:string = '';
  search:any={
    search:"",
    area_prioritaria_id:null
  };

  onInputChange(value: any) {
    this.inputSubject.next(value.target.value);
  }

  getAreas(){
    this.areaPrioritariaService.getAreaPrioritaria()
    .subscribe(({data})=>{
      this.areas = data
    })
  }

  getLienas(){
    this.lineaInvestigacionService.getLineaInvestigacion()
    .subscribe(e=>{
      this.lineas = e;
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
    this.form.get('name').setValue(name.toUpperCase())
    this.lineaInvestigacionService.storeLineaInvestigacion(this.form.value)
    .subscribe({
      next: (e)=>{
        this.getLienas()
        this.modalActive.close()
        this.loading = false;
        this.SuccessRegisterSwal.fire()
      },
      error: ({error}) => {
        console.log(error)
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

    this.lineaInvestigacionService.updateLineaInvestigacion(this.idEdit,this.form.value)
    .subscribe({
      next: (e)=>{
        this.getLienas()
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
    this.lineaInvestigacionService.deleteLineaInvestigacion(id)
    .subscribe(e=>{
      this.getLienas()
      this.successDeleteSwal.fire()
    })
  }

  changeArea(data:any){
    console.log(data)
    this.search = {...this.search,area_prioritaria_id:data};
    this.searchLinea()
  }

  searchLinea() {
    this.loading = true;

    this.lineaInvestigacionService.search(this.search)
      .subscribe(e => {
        console.log(e)
        this.loading = false;
        this.lineas = e.data
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
