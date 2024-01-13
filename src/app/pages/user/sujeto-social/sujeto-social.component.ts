import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { SujetoSocialService } from 'src/app/pages/services/sujeto-social.service';
import { DimensionEspacialService } from '../../services/dimension-espacial.service';


@Component({
  selector: 'app-sujeto-social',
  templateUrl: './sujeto-social.component.html',
  styleUrls: ['./sujeto-social.component.scss']
})
export class SujetoSocialComponent implements OnInit, AfterViewInit{

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private sujetoSocialService:SujetoSocialService,
    private dimensionEspacialService:DimensionEspacialService,
  ){
  }
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;


  ngOnInit(): void {
    this.getDimensionEspacial()
    this.getSujetoSocial()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""
    this.form.get('name')
    .valueChanges.subscribe(()=> this.error = '')
  }

  form = this.formBuilder.group({
    DimensionEspacialId: [null, Validators.required],
    name: ['', Validators.required],
  })

  displayedColumns: string[] = ['Dimensión espacial', 'Sujeto social', 'Opt.'];
  dimensiones:any=[];
  sujetos:any=[];
  modalActive: any;
  edit:boolean = false;
  idEdit:number=0;
  loading:boolean = false;
  error:string = '';


  getDimensionEspacial(){
    this.dimensionEspacialService.getDimensionEspacial()
    .subscribe(e=>{
      this.dimensiones = e;
      console.log(e)
    })
  }

  getSujetoSocial(){
    this.sujetoSocialService.getSujetoSocial()
    .subscribe(e=>{
      this.sujetos = e;
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

    this.sujetoSocialService.storeSujetoSocial(this.form.value)
    .subscribe({
      next: (e)=>{
        this.modalActive.close()
        this.loading = false;
        this.SuccessRegisterSwal.fire()
        this.getSujetoSocial()
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

    this.sujetoSocialService.updateSujetoSocial(this.idEdit,this.form.value)
    .subscribe({
      next: (e)=>{
        this.modalActive.close()
        this.loading = false;
        this.SuccessUpdateSwal.fire()
        this.getSujetoSocial()
      },
      error: (error) => {
        this.loading = false;
      }
    })
  }

  remove(id:number){
    this.sujetoSocialService.deleteSujetoSocialo(id)
    .subscribe(e=>{
      this.successDeleteSwal.fire()
      this.getSujetoSocial()
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
