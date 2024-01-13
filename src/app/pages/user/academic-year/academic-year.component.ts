import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import * as dayjs from 'dayjs';
import { MatDateFormats } from '@angular/material/core';
import { AcademicYearService } from '../../services/academic-year.service';


@Component({
  selector: 'app-academic-year',
  templateUrl: './academic-year.component.html',
  styleUrls: ['./academic-year.component.scss'],

})
export class AcademicYearComponent implements OnInit, AfterViewInit {


  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private academicYearService: AcademicYearService
  ) {

  }
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;

  date_from: any;
  date_from_format: any;
  date_to: any;
  date_to_format: any;

  ngOnInit(): void {
    this.getAcademicYears()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""

  }

  form = this.formBuilder.group({
    academicYear: [''],
    academicYearFrom: ['', Validators.required],
    academicYearTo: ['', Validators.required],
  })

  displayedColumns: string[] = ['Nombre', 'Opt.'];
  academicYears: any = [];
  modalActive: any;
  edit: boolean = false;
  idEdit: number = 0;
  loading: boolean = false;
  error: string = null;


  getAcademicYears() {
    this.academicYears = [];
    this.academicYearService.getAcademicYear()
      .subscribe(e => {
        this.academicYears = e;
        console.log(e)
      })
  }

  store() {
    this.error = null
    if (this.form.invalid || this.date_to < this.date_from) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    // this.form.get('name').setValue(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
    this.academicYearService.storeAcademicYear({ year: this.getAcademicYear() })
      .subscribe({
        next: (e) => {
          this.getAcademicYears()
          this.modalActive.close()
          this.loading = false;
          this.SuccessRegisterSwal.fire()
          this.form.reset()
          this.date_from = null;
          this.date_from_format = null;
          this.date_to = null;
          this.date_to_format = null;
        },
        error: ({ error: { error } }) => {
          this.loading = false;
          this.error = error.mensaje;
        }
      })
  }


  update() {
    this.error = null

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.academicYearService.updateAcademicYear(this.idEdit, { year: this.getAcademicYear() })
      .subscribe({
        next: (e) => {
          this.getAcademicYears()
          this.modalActive.close()
          this.loading = false;
          this.SuccessUpdateSwal.fire()
        },
        error: ({ error: { error } }) => {
          this.loading = false;
          this.error = error.mensaje;
        }
      })
  }

  remove(id: number) {
    this.academicYearService.deleteAcademicYear(id)
      .subscribe(e => {
        this.getAcademicYears()
        this.successDeleteSwal.fire()
      })
  }

  setEdit(data: any) {
    console.log(data.year.split('-'))
    this.form.get('academicYearFrom').setValue(data.year.split('-')[0].trim())
    this.form.get('academicYearTo').setValue(data.year.split('-')[1].trim())
    this.date_from = data.year.split('-')[0].trim();
    this.date_to = data.year.split('-')[1].trim();
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
    this.error = null;
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

  setFrom(date: any, picker_from: any) {
    console.log(date)
    this.date_from = dayjs(date).format('YYYY')
    this.date_from_format = date;
    this.form.get('academicYearFrom').setValue(this.date_from)
    picker_from.close();
  }

  setTo(date: any, picker_from: any) {
    this.date_to = dayjs(date).format('YYYY')
    this.date_to_format = date;
    this.form.get('academicYearTo').setValue(this.date_to)
    picker_from.close();

  }


  getAcademicYear() {
    const yearFrom = this.form.get('academicYearFrom').value;
    const yearTo = this.form.get('academicYearTo').value;
    return `${yearFrom} - ${yearTo}`
  }

  setYear(event: any, datepicker: any) {
    this.form.get('academicYear').setValue(event)
    datepicker.close();
  }

  clearTo() {
    this.date_to = null
    this.date_to_format = null
  }

  clearFrom() {
    this.date_from = null
    this.date_from_format = null
  }


  getFieldError(field:string, error:string){
    return this.form.get(field).hasError(error)
  }
}
