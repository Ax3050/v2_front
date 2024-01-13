import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AreaPrioritariaService } from '../../services/area-prioritaria.service';
import { PnfService } from '../../services/pnf.service';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-area-prioritaria',
  templateUrl: './area-prioritaria.component.html',
  styleUrls: ['./area-prioritaria.component.scss']
})
export class AreaPrioritariaComponent implements OnInit, AfterViewInit{

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private areaPrioritariaService:AreaPrioritariaService,
    private pnfServices:PnfService,
  ){
  }
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;
  private inputSubject = new Subject<string>();

  ngOnInit(): void {
    this.getAreas()
    this.getPnfs()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""

    this.form.get('name')
    .valueChanges.subscribe(()=> this.error = '')

    this.inputSubject.pipe(debounceTime(500)).subscribe((e) => {
      console.log(e)
      this.search = {...this.search, search:e}
      this.searchArea()

    });
  }

  form = this.formBuilder.group({
    name: ['', Validators.required],
    pnfId: [null, Validators.required],
  })

  displayedColumns: string[] = ['Nombre', 'PNF', 'Opt.'];
  pnfs:any=[];
  areas:any=[];
  modalActive: any;
  edit:boolean = false;
  idEdit:number=0;
  loading:boolean = false;
  error:string = '';
  search:any={
    search:null,
    pnf:null
  };

  getAreas(){
    this.areaPrioritariaService.getAreaPrioritaria()
    .subscribe(e=>{
      this.areas = e;
      console.log(e)
    })
  }

  getPnfs(){
    this.pnfServices.getPnf()
    .subscribe(e=>{
      this.pnfs = e;
      console.log(e)
    })
  }

  onInputChange(value: any) {
    this.inputSubject.next(value.target.value);
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
    this.areaPrioritariaService.storeAreaPrioritaria(this.form.value)
    .subscribe({
      next: (e)=>{
        this.getAreas()
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

    this.areaPrioritariaService.updateAreaPrioritaria(this.idEdit,this.form.value)
    .subscribe({
      next: (e)=>{
        this.getAreas()
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
    this.areaPrioritariaService.deleteAreaPrioritaria(id)
    .subscribe(e=>{
      this.getAreas()
      this.successDeleteSwal.fire()
    })
  }

  setEdit(data:any){
    this.form.patchValue(data)
    this.idEdit = data?.id;
    this.edit = true;
    this.openModal()
  }

  changePnf(data:any){
    console.log(data)
    this.search = {...this.search,pnf:data};
    this.searchArea()
  }

  searchArea() {
    this.loading = true;

    this.areaPrioritariaService.search(this.search)
      .subscribe(e => {
        console.log(e)
        this.loading = false;
        this.areas = e
      })
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
