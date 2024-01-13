import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material/material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './pages/nav/nav.component';
import { InvestigatorsComponent } from './pages/user/investigators/investigators.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EstadoComponent } from './pages/user/location/estado/estado.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MunicipioComponent } from './pages/user/location/municipio/municipio.component';
import { ParroquiaComponent } from './pages/user/location/parroquia/parroquia.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { OnlyLetterDirective } from './directives/only-letter.directive';
import { HomeComponent } from './pages/user/home/home.component';
import { PnfComponent } from './pages/user/pnf/pnf.component';
import { TrayectoComponent } from './pages/user/trayecto/trayecto.component';
import { SeccionComponent } from './pages/user/seccion/seccion.component';
import { BulkImportComponent } from './pages/user/bulk-import/bulk-import.component';
import { ProjectComponent } from './pages/user/project/project.component';
import { TeacherComponent } from './pages/user/teacher/teacher.component';
import { ProjectInvestigatorComponent } from './pages/user/project-investigator/project-investigator.component';
import { AreaPrioritariaComponent } from './pages/user/area-prioritaria/area-prioritaria.component';
import { LineaInvestigacionComponent } from './pages/user/linea-investigacion/linea-investigacion.component';
import { DimensionEspacialComponent } from './pages/user/dimension-espacial/dimension-espacial.component';
import { SujetoSocialComponent } from './pages/user/sujeto-social/sujeto-social.component';
import { AcademicYearComponent } from './pages/user/academic-year/academic-year.component';
import { ReportStatusComponent } from './pages/user/report-status/report-status.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    InvestigatorsComponent,
    LoginComponent,
    OnlyNumbersDirective,
    EstadoComponent,
    MunicipioComponent,
    ParroquiaComponent,
    SignupComponent,
    OnlyLetterDirective,
    HomeComponent,
    PnfComponent,
    TrayectoComponent,
    SeccionComponent,
    BulkImportComponent,
    ProjectComponent,
    TeacherComponent,
    ProjectInvestigatorComponent,
    AreaPrioritariaComponent,
    LineaInvestigacionComponent,
    DimensionEspacialComponent,
    SujetoSocialComponent,
    AcademicYearComponent,
    ReportStatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
