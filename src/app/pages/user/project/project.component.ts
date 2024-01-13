import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { PnfService } from 'src/app/pages/services/pnf.service';
import { TrayectoService } from '../../services/trayecto.service';
import { SeccionService } from '../../services/seccion.service';
import { AcademicYearService } from '../../services/academic-year.service';
import { InvestigatorService } from '../../services/investigator.service';
import { AreaPrioritariaService } from '../../services/area-prioritaria.service';
import { DimensionEspacialService } from '../../services/dimension-espacial.service';
import { LineaInvestigacionService } from '../../services/linea-investigacion.service';
import { SujetoSocialService } from '../../services/sujeto-social.service';
import { ProjectService } from '../../services/project.service';
import { TeacherService } from '../../services/teacher.service';
import { LocationService } from '../../services/location.service';
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, AfterViewInit {
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private pnfServices: PnfService,
    private trayectoServices: TrayectoService,
    private seccionService: SeccionService,
    private academicYearService: AcademicYearService,
    private investigatorService: InvestigatorService,
    private areaPrioritariaService: AreaPrioritariaService,
    private dimensionEspacialService: DimensionEspacialService,
    private lineaInvestigacionService: LineaInvestigacionService,
    private sujetoSocialService: SujetoSocialService,
    private teacherService: TeacherService,
    private projectService: ProjectService,
    private locationService: LocationService
  ) {
  }
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;
  @ViewChild('desincorporarSwal') desincorporarSwal!: SwalComponent;
  @ViewChild('abandonoSwal') abandonoSwal!: SwalComponent;

  ngOnInit(): void {
    this.getEstados()
    this.getProjects()
    this.getPnfs()
    // this.getTrayectos()
    this.getAcademicYear()
    // this.getAreas()
    // this.getDimension()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""

    this.form.get('pnfId').valueChanges.subscribe(e => {
      this.trayectos = []
      if (e) {
        this.getAreas(e)
        this.trayectos = this.pnfs.data.find((pnf: any) => pnf.id == e)?.trayectos;
        console.log('trayectos ', this.trayectos)
      } else {
        this.secciones = [];
      }
      this.form.get('AreaPrioritariaId').reset()
    })

    this.form.get('trayectoId').valueChanges.subscribe(e => {
      e ? this.getSecciones() : this.secciones = [];
      this.form.get('seccionId').reset()
    })

    this.form.get('AreaPrioritariaId').valueChanges.subscribe(e => {
      e && this.getLineaById(e);
    })

    this.form.get('DimensionEspacialId').valueChanges.subscribe(e => {
      e && this.getSulejoById(e);
    })

    this.form.get('estadoId')?.valueChanges.
      subscribe((e: any) => {
        this.municipios = [];
        this.form.get('municipioId')?.reset()
        e && this.getMunicipiosById(e)
      })

    this.form.get('municipioId')?.valueChanges.
      subscribe((e: any) => {
        this.parroquias = [];
        this.form.get('parroquiaId')?.reset()
        e && this.getParroquiaById(e)
      })

    this.form.get('parroquiaId')?.valueChanges.
      subscribe((e: any) => {
        this.dimeniones = [];
        this.form.get('DimensionEspacialId')?.reset()
        e && this.getDimension(e)
      })
  }

  form = this.formBuilder.group({
    name: ['', Validators.required],
    trayectoId: [null, Validators.required],
    pnfId: [null, Validators.required],
    seccionId: [null, Validators.required],
    AcademicYearId: [null, Validators.required],
    AreaPrioritariaId: [null, Validators.required],
    LineaInvestigacionId: [null, Validators.required],
    DimensionEspacialId: [null, Validators.required],
    sujetoSocial: [null, Validators.required],
    estadoId: [null, Validators.required],
    municipioId: [null, Validators.required],
    parroquiaId: [null, Validators.required],
  })

  displayedColumns: string[] = ['Nombres', 'Apellidos', 'Cedula', 'Expediente', 'Opt.'];
  pnfs: any = [];
  investigators: any = [];
  trayectos: any = [];
  secciones: any = [];
  academicYears: any = [];
  areas: any = [];
  dimeniones: any = [];
  lineas: any = []
  inv_selected: any = []
  sujetos: any = [];

  estados: any = [];
  municipios: any = [];
  parroquias: any = [];

  proyectos_cursantes: any = []
  proyectos_cerrados: any = []
  proyectos: any = []

  modalActive: any;
  modalDesinc: any;
  edit: boolean = false;
  idEdit: number = 0;
  loading: boolean = false;
  error: string = '';
  user: any = JSON.parse(localStorage.getItem('user'))
  projectData: any = null;
  invIncorporate: any = null;

  getEstados() {
    this.locationService.getEstados()
      .subscribe(e => {
        this.estados = e;
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


  getProjects() {
    this.teacherService.getProjectsById(this.user?.peopleId)
      .subscribe(e => {
        const groupedArray = e.reduce((result, item) => {

          const { seccionId, seccion: { name }, ...rest } = item;
          const existingGroup = result.find(group => group.name === name);
          if (existingGroup) {
            existingGroup.grupo.push({ seccionId, ...rest.seccion, ...item });
          } else {
            result.push({ name, grupo: [{ seccionId, ...item.seccion, ...item }] });
          }

          return result;
        }, []);
        this.proyectos = groupedArray
      })
  }


  getAreas(id: any) {
    this.areaPrioritariaService.getAreaByPnf(id)
      .subscribe(e => {
        this.areas = e;
      })
  }

  getDimension(id: any) {
    this.dimensionEspacialService.getDimensionByParroquiaId(id)
      .subscribe(e => {
        this.dimeniones = e;
      })
  }

  getPnfs() {
    this.pnfServices.getPnf()
      .subscribe(e => {
        this.pnfs = e;
      })
  }

  getTrayectos() {
    this.trayectoServices.getTrayecto()
      .subscribe(e => {
        this.trayectos = e;
      })
  }

  getAcademicYear() {
    this.academicYearService.getAcademicYear()
      .subscribe(e => {
        this.academicYears = e;
      })
  }

  getSecciones() {

    this.seccionService.getSeccionesById(this.getFieldValue('pnfId'), this.getFieldValue('trayectoId'))
      .subscribe(e => {
        this.secciones = e
      })
  }

  getIvestigators() {
    this.error = ''
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    // let name:string = this.form.get('name').value;
    // this.form.get('name').setValue(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
    this.investigatorService.getListForTeacher(this.projectData)
   
    
      .subscribe({
        next: ({ data: { data } }) => {
          this.investigators = [];
          // this.modalActive.close()
          this.loading = false;
          this.projectData.projectStudent.map((inv: any) => {
            this.investigators.push({ ...inv.investigator, isProject: true, status: inv.status })
          })
          this.investigators = this.investigators.concat(data)
          // this.SuccessRegisterSwal.fire()
          console.log('investigator ', this.investigators)
        
        },
        error: ({ error }) => {
          this.error = error.message
          this.loading = false;
        }
      })
      
  }

  getLineaById(id: number) {
    this.lineaInvestigacionService.getLineaInvestigacionById(id)
      .subscribe(e => {
        this.lineas = e;
      })

  }

  getSulejoById(id: number) {
    this.sujetoSocialService.getSujetoSocialById(id)
      .subscribe(e => {
        this.sujetos = e
      })
  }

  changeStatus(data: any, status: number, observation:string = null) {
    const send:any = {
      status
    }
    if(status == 4){
      send.description = observation;
    }

    this.projectService.changeStatus(data.id, send)
      .subscribe(e => {
        this.getProjects()
      })
  }


  storeProject() {
    const data = {
      project: { ...this.form.value, status: 0 },
      students: this.inv_selected
    }

    this.projectService.storeProject(data)
      .subscribe(e => {
        // this.proyectos = e.rows
      })
  }


  update() {
    this.error = ''

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.projectService.update(this.idEdit, { project: this.form.value, students: this.inv_selected })
      .subscribe({
        next: (e) => {
          this.getProjects()
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
    this.pnfServices.deletePnf(id)
      .subscribe(e => {
        this.getPnfs()
        this.successDeleteSwal.fire()
      })
  }

  setEdit(data: any) {
    const { DimensionEspacial: {

      parroquia: {
        id: parroquiaId,
        municipio: {
          id: municipioId,
          estado: {
            id: estadoId
          }
        }
      }
    } } = data;
    console.log(data)
    this.projectData = data;
    this.form.patchValue(data)
    this.form.get('seccionId').setValue(data.seccionId)
    this.form.get('estadoId').setValue(estadoId)
    this.form.get('municipioId').setValue(municipioId)
    this.form.get('parroquiaId').setValue(parroquiaId)
    this.form.get('DimensionEspacialId').setValue(data.DimensionEspacialId)

    // this.form.get('trayectoId').setValue(data.trayectoId)
    // this.form.get('AcademicYearId').setValue(data.academicYearId)
    this.getIvestigators()
    this.idEdit = data?.id;
    this.edit = true;
    this.openModal()
    this.inv_selected = data.projectStudent.map((e) => {
      return { id: e.investigatorId, status: e.status }
    })
  }

  changeStatusInvestigator() {
    const { id, status } = this.invIncorporate;
    console.log(this.invIncorporate)
    this.projectService.changeStatusInvestigator(id, { status })
      .subscribe((e: any) => {
        let investigators = [...this.investigators]
        const index = investigators.findIndex((investigator: any) => investigator.id == e.data.investigatorId);
        investigators[index] = { ...this.investigators[index], status: e.data.status }
        this.investigators = [];
        this.investigators = investigators;
        this.getProjects()
      })
  }

  incorporateInv(id: any, status: any) {
    this.invIncorporate = { id, status }
    this.changeStatusInvestigator()
  }

  paginate(event: any) {
    console.log(event)
  }

  checkStudent(id: number) {
    const index = this.inv_selected.findIndex(e => e == id);

    if (!this.idEdit) {
      if (index != -1) {
        this.inv_selected.splice(index, 1)
      } else {
        this.inv_selected.push(id)
      }
    } else {
      if (index != -1) {
        this.inv_selected.splice(index, 1)
      } else {
        const inv = this.investigators.find((e: any) => e.id == id)
        this.inv_selected.push({ id: inv.id, status: 0 })
        const index = this.investigators.findIndex((e: any) => e.id == id)
        this.investigators[index] = { ...this.investigators[index], isProject: true, status: 0 }
        const invs = [...this.investigators];
        this.investigators = [];
        this.investigators = invs;
        console.log(this.investigators)
      }
    }

  }

  isChecked(id: number) {
    return this.inv_selected.findIndex(e => e == id) != -1
  }

  getFieldInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched
  }

  getFieldValue(field: string) {
    return this.form.get(field).value;
  }

  openModal() {
    this.modalActive = this.dialog.open(this.modal,
      {
        maxWidth: '800px',
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


  openModalAbandono(project:any){
    this.modalDesinc = this.abandonoSwal.fire()
    this.modalDesinc.then((result) => {
      if (result.isConfirmed) {
        this.changeStatus(project, 4, result.value)
        console.log(result)

      }
    });
  }

  openModalDesincorp(id: any, status: any) {
    this.invIncorporate = { id, status }
    this.modalDesinc = this.desincorporarSwal.fire()
    this.modalDesinc.then((result) => {
      if (result.value) {

        const index = this.investigators.findIndex((e: any) => e.id == id);

        if (this.investigators[index].pnf) {
          delete this.investigators[index].status;
          delete this.investigators[index].isProject;
          this.getProjects()

        } else {
          this.changeStatusInvestigator()
        }

      }
    });
  }

  openModalPDF() {
    
  }

  uploadPDF() {
    const fileInput = document.getElementById("pdfFile") as HTMLInputElement;
    const file = fileInput.files[0];
    console.log(file);
  }
}



