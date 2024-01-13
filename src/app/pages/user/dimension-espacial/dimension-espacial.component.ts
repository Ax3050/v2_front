import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DimensionEspacialService } from '../../services/dimension-espacial.service';
import { LocationService } from '../../services/location.service';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-dimension-espacial',
  templateUrl: './dimension-espacial.component.html',
  styleUrls: ['./dimension-espacial.component.scss']
})
export class DimensionEspacialComponent implements OnInit, AfterViewInit {

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private dimensionEspacialService: DimensionEspacialService,
    private locationService: LocationService
  ) {
  }
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;
  private inputSubject = new Subject<string>();

  ngOnInit(): void {
    this.getLienas();
    this.getEstados()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""

    this.form.get('name')
      .valueChanges.subscribe(() => this.error = '')

    this.form.get('estadoId')?.valueChanges.
      subscribe((e: any) => {
        console.log(e)
        this.municipios = [];
        this.form.get('municipioId')?.reset()
        e && this.getMunicipiosById(e)
      })

    this.form.get('municipioId')?.valueChanges.
      subscribe((e: any) => {
        console.log(e)
        this.parroquias = [];
        this.form.get('parroquiaId')?.reset()
        e && this.getParroquiaById(e)
      })

      this.inputSubject.pipe(debounceTime(500)).subscribe((e) => {
        console.log(e)
        this.search = {...this.search, search:e}
        this.searchDimension()

      });
  }

  form = this.formBuilder.group({
    name: ['', Validators.required],
    estadoId: [null, Validators.required],
    municipioId: [null, Validators.required],
    parroquiaId: [null, Validators.required],
  })

  estados: any = [];
  municipios: any = [];
  parroquias: any = [];

  displayedColumns: string[] = ['Nombre', 'Estado', 'Municipio', 'Parroquia', 'Opt.'];
  lineas: any = [];
  modalActive: any;
  edit: boolean = false;
  idEdit: number = 0;
  loading: boolean = false;
  error: string = '';
  search:any={
    search:"",
    estado_id:null
  };

  onInputChange(value: any) {
    this.inputSubject.next(value.target.value);
  }


  getEstados() {
    this.locationService.getEstados()
      .subscribe(e => {
        this.estados = e;
        console.log(e)
      })
  }

  getMunicipiosById(id: number) {
    this.locationService.getMunicipiosById(id)
      .subscribe(e => {
        this.municipios = e
      })
  }

  getParroquiaById(id: number) {
    this.locationService.getParroquiasById(id)
      .subscribe(e => {
        this.parroquias = e
      })
  }


  getLienas() {
    this.dimensionEspacialService.getDimensionEspacial()
      .subscribe(e => {
        this.lineas = e;
        console.log(e)
      })
  }

  store() {
    this.error = ''
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    let name: string = this.form.get('name').value;
    let data = this.form.value;
    delete data.estadoId;
    delete data.municipioId;

    this.dimensionEspacialService.storeDimensionEspacial(data)
      .subscribe({
        next: (e) => {
          this.getLienas()
          this.modalActive.close()
          this.loading = false;
          this.SuccessRegisterSwal.fire()
        },
        error: ({ error }) => {
          console.log(error)
          this.error = error.message
          this.loading = false;
        }
      })
  }


  update() {
    this.error = ''

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    let data = this.form.value;
    delete data.estadoId;
    delete data.municipioId;
    this.dimensionEspacialService.updateDimensionEspacial(this.idEdit, data)
      .subscribe({
        next: (e) => {
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

  remove(id: number) {
    this.dimensionEspacialService.deleteDimensionEspacial(id)
      .subscribe(e => {
        this.getLienas()
        this.successDeleteSwal.fire()
      })
  }


  changeEstado(data:any){
    this.search = {...this.search, municipio_id:null, parroquia_id:null}
    console.log(data)
    if(!data){
      this.municipios.data = null
    }else{
      this.getMunicipiosById(data)
    }
    this.search = {...this.search,estado_id:data};

    this.searchDimension()
  }

  changeMunicipio(data:any){
    this.search = {...this.search, parroquia_id:null}
    if(!data){
      this.parroquias.data = null
    }else{
      this.getParroquiaById(data)
    }
    console.log(data)
    this.search = {...this.search,municipio_id:data};
    this.getParroquiaById(data)
    this.searchDimension()
  }

  changeParroquia(data:any){
    if(!data){
      this.parroquias.data = null
    }

    console.log(data)
    this.search = {...this.search,parroquia_id:data};
    this.searchDimension()
  }

  searchDimension() {
    this.loading = true;

    this.dimensionEspacialService.search(this.search)
      .subscribe(e => {
        console.log(e)
        this.loading = false;
        this.lineas = e.data
      })
  }


  setEdit(data: any) {
    const {
      parroquia: {
        id: parroquiaId,
        municipio: {
          id: municipioId,
          estado:{
            id:estadoId
          }
        }
      }
    } = data;

    this.form.patchValue({...data,estadoId})
    this.form.get('municipioId').setValue(municipioId);
    this.form.get('parroquiaId').setValue(parroquiaId);

    this.idEdit = data?.id;
    this.edit = true;
    this.openModal()
  }

  paginate(event: any) {
    console.log(event)
  }

  getFieldInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched
  }

  openModal() {
    this.modalActive = this.dialog.open(this.modal,
      {
        maxWidth: '500px',
        maxHeight: 'max-content',
        height: 'max-content',
        width: '100%',
        panelClass: 'full-screen-modal'
      })
    this.modalActive.afterClosed().subscribe(() => {
      this.edit = false;
      this.form.reset()
    })
  }
}
