import { Component, TemplateRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PnfService } from '../../services/pnf.service';
import { TrayectoService } from '../../services/trayecto.service';
import { SeccionService } from '../../services/seccion.service';
import { TeacherService } from '../../services/teacher.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authServices: AuthService,
    private formBuilder: FormBuilder,
    private rutaActiva: ActivatedRoute,
    private pnfServices: PnfService,
    private trayectoServices: TrayectoService,
    private seccionService: SeccionService,
    private teacherService: TeacherService,
  ) { }

  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessSwal') SuccessSwal!: SwalComponent;

  ngOnInit(): void {
    this.rutaActiva.queryParams
      .subscribe((e: any) => {
        this.type = parseInt(e?.type)
        this.form.get('role')?.setValue(this.type == 1 ? 'teacher' : 'student')
        this.disableInputs = true
        this.getPnfs()
        this.getTrayectos()
      })
  }

  ngAfterViewInit(): void {
    this.formTeacher.get('trayectosId')
      .valueChanges.subscribe(e => {
        this.formTeacher.get('seccionesId').reset()
        e && this.getSecciones()
      })

    this.formTeacher.get('pnfId')
      .valueChanges.subscribe(e => {
        this.formTeacher.get('seccionesId').reset()
        this.formTeacher.get('trayectosId').reset()
      })

    this.formTeacher.get('seccionesId')
      .valueChanges.subscribe(e => {
        this.error = false;
        e ? this.canAdd = true : this.canAdd = false
      })

    // this.formInvestigator.get('trayectoId')
    //   .valueChanges.subscribe(e => {
    //     this.formInvestigator.get('seccionId').reset()
    //     e && this.getSecciones()
    //   })

    // this.formInvestigator.get('pnfId')
    //   .valueChanges.subscribe(e => {
    //     this.formInvestigator.get('seccionId').reset()
    //     this.formInvestigator.get('trayectoId').reset()
    //   })

    // this.formInvestigator.get('seccionId')
    //   .valueChanges.subscribe(e => {
    //     this.error = false;
    //     e ? this.canAdd = true : this.canAdd = false
    //   })
  }

  form = this.formBuilder.group({
    role: ['', Validators.required],
    email: [null, Validators.required],
    password: [null, Validators.required],
    people: this.formBuilder.group({
      name: [null, Validators.required],
      lastname: [null, Validators.required],
      nationality: [1],
      cedula: [null,[ Validators.required, Validators.minLength(7)]],
    }),
  })

  formInvestigator = this.formBuilder.group({
    exp: [null],
    trayecto: [null],
    pnf: [''],
    seccion: [null],
    people: this.formBuilder.group({
      name: [null],
      lastname: [null],
      nationality: [1],
      cedula: [null],
    }),
    user: this.formBuilder.group({
      role: ['student', Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
    })
  })

  formTeacher = this.formBuilder.group({
    idTeacher: ['', Validators.required],
    pnfId: [null, Validators.required],
    trayectosId: [null, Validators.required],
    seccionesId: [null, Validators.required],
  })

  trayectos: any = [];
  secciones: any = [];
  pnfs: any = [];

  asignaturas: any = []
  deleteAsignaturas: any = [];

  trayectoId = null;
  seccionId = null;
  peopleId: number = 0;
  dataTeacher: any;

  type: number = 0
  error: boolean = false;
  errorT: number = 0;
  err:string =null;
  loading: boolean = false;
  viewPass: boolean = false;
  step: number = 0
  canAdd: boolean = false;
  disableInputs: boolean = false;

  getPnfs() {
    this.pnfServices.getPnf()
      .subscribe(e => {
        this.pnfs = e;
        console.log(e)
      })
  }

  getTrayectos() {
    this.trayectoServices.getTrayecto()
      .subscribe(e => {
        this.trayectos = e;
        console.log(e)
      })
  }

  findTeacherCi() {
    this.errorT = 0
    this.dataTeacher = null;
    const ci = this.type == 1 ? this.form.value.people.cedula : this.formInvestigator.value.people.cedula ;
    this.form.reset({ role: 'teacher', people: { nationality: 1, cedula: ci } })
    this.formInvestigator.reset({ user:{role: 'student'}, people: { nationality: 1, cedula: ci } })

    if (!ci) {
      return
    }
    this.loading = true;

    this.teacherService.findTeacherCi(ci)
      .subscribe(e => {

        this.loading = false;
        if(this.type == 1 && e.type == 3){
          this.errorT = 2;
          return
        }

        if( e.type == 1){
          this.errorT = 1;
          return
        }

        if( this.type == 2 && !e.data.investigator){
          this.errorT = 2;
          return
        }

        if(e.data?.user !== null){
          this.errorT = 3;
          return
        }

        this.disableInputs = false;
        if (e.data) {
          this.type == 1 && (this.dataTeacher = e.data);
          this.peopleId = e.data.id;
          this.type == 1 && this.form.patchValue({ people: e.data })

          this.type == 1 && (this.asignaturas = e.data.teacher)
          if(this.type == 2){
            this.formInvestigator.patchValue({people:e.data}, e.data.investigator)
            this.formInvestigator.patchValue(e.data.investigator)
            this.formInvestigator.get('pnf').setValue(e.data.investigator.pnf.name)
            this.formInvestigator.get('trayecto').setValue(e.data.investigator.trayecto.name)
            this.formInvestigator.get('seccion').setValue(e.data.investigator.seccion.name)
          }
        }
        console.log(e)
      })
  }

  signup() {
    this.error = false;
    console.log(this.form.value)
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    let formData: any = this.form.value;
    // formData.people.cedula.length == 7 && (formData.people.cedula = `0${formData.people.cedula}`);

    if (this.dataTeacher) {
      delete formData.people;
      formData.peopleId = this.peopleId
    }else{
    }



    this.authServices.signUp(formData)
      .subscribe({
        next: ({ data }) => {
          if (this.type == 2) {
            this.SuccessSwal.fire()
            this.router.navigate(['/'])
          } else {
            this.loading = false;
            this.step = 1
            data?.people?.id && (this.peopleId = data?.people?.id)
          }
        },
        error: ({error:{error}}) => {
          this.loading = false;
          this.err = error.mensaje;
        }
      })
  }

  signupInvestigator(){
    console.log(this.formInvestigator.value)

    if (this.formInvestigator.invalid) {
      this.formInvestigator.markAllAsTouched();
      return;
    }
    this.loading = true;
    let formData: any = this.formInvestigator.value;
    formData.user.peopleId = this.peopleId

    this.authServices.signUpInvestigator(formData)
    .subscribe({
      next: ({ data }) => {
        this.SuccessSwal.fire()
        this.router.navigate(['/'])
      },
      error: ({error:{error}}) => {
        this.loading = false;
        this.err = error.mensaje;
      }
    })
  }

  storeSignatures() {
    this.loading = true;
    let data = this.asignaturas.map((e: any) => {
      const col = {
        seccionId: e.seccion.id,
        trayectoId: e.trayecto.id,
        pnfId: e.pnf.id,
        peopleId: this.peopleId,
      };
      return col
    })
    console.log('data delete', this.deleteAsignaturas.length)
    if (this.deleteAsignaturas.length > 0) {
      this.teacherService.deleteTeacher(this.deleteAsignaturas)
        .subscribe()
    }

    this.teacherService.storeTeacher(data)
      .subscribe({
        next: e => {
          this.SuccessSwal.fire()
          this.router.navigate(['/'])
          this.loading = false;
        },
        error: (e) => {
          this.loading = false;
        }
      })
  }

  setList() {
    const asignatura = {
      pnf: this.pnfs.data.find(e => e.id == this.formTeacher.get('pnfId').value),
      trayecto: this.trayectos.data.find(e => e.id == this.formTeacher.get('trayectosId').value),
      seccion: this.secciones.data.find(e => e.id == this.formTeacher.get('seccionesId').value)
    }
    if (this.asignaturas.findIndex(e => e.seccion.id === asignatura.seccion.id) == 0) {
      this.error = true;
      return
    }
    this.asignaturas.push(asignatura)
    this.formTeacher.get('trayectosId').reset()
    this.formTeacher.get('seccionesId').reset()
    console.log(this.asignaturas)
  }

  removeList(index) {
    if (this.asignaturas[index]?.id) {
      console.log('sisa')
      this.deleteAsignaturas.push({ id: this.asignaturas[index]?.id });
    }
    this.asignaturas.splice(index, 1)
  }

  getSecciones() {

    if (this.getFieldTeacher('pnfId')) {
      this.seccionService.getSeccionesById(this.getFieldTeacher('pnfId'), this.getFieldTeacher('trayectosId'))
        .subscribe(e => {
          this.secciones = e
        })
    } else {
      this.seccionService.getSeccionesById(this.getFieldValueInv('pnfId'), this.getFieldValueInv('trayectoId'))
        .subscribe(e => {
          this.secciones = e
        })
    }

  }

  getFieldInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched
  }

  getFieldInvalidInv(field: string) {
    return this.formInvestigator.get(field)?.invalid && this.formInvestigator.get(field)?.touched
  }

  getFieldValueInv(field: string) {
    return this.formInvestigator.get(field).value;
  }


  getFieldTeacher(field: string) {
    return this.formTeacher.get(field)?.value
  }

  getFieldValue(field: string) {
    return this.form.get(field).value;
  }

  getField(field:string){
    return this.form.get(field)
  }

  openModal() {
    this.dialog.open(this.modal,
      {
        maxWidth: '600px',
        maxHeight: 'max-content',
        height: 'max-content',
        width: 'max-content',
        panelClass: 'full-screen-modal'
      }).beforeClosed()
      .subscribe(e => {
      })
  }


}
