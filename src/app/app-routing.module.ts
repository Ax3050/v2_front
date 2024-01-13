import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { NavComponent } from './pages/nav/nav.component';
import { InvestigatorsComponent } from './pages/user/investigators/investigators.component';
import { EstadoComponent } from './pages/user/location/estado/estado.component';
import { MunicipioComponent } from './pages/user/location/municipio/municipio.component';
import { ParroquiaComponent } from './pages/user/location/parroquia/parroquia.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { UnAuthGuard } from './guards/un-auth.guard';
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


const routes: Routes = [
  {
    path: '',
    canActivate:[UnAuthGuard],
    component:LoginComponent,
  },
  {
    path: 'signup',
    canActivate:[UnAuthGuard],
    component:SignupComponent,
  },

  {
    path: 'user',
    canActivate:[AuthGuard],
    component:NavComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'investigator', component: InvestigatorsComponent },
      { path: 'location/state', component: EstadoComponent },
      { path: 'location/municipio', component: MunicipioComponent },
      { path: 'location/parroquia', component: ParroquiaComponent },
      { path: 'institution/pnf', component: PnfComponent },
      { path: 'institution/trayecto', component: TrayectoComponent },
      { path: 'institution/seccion', component: SeccionComponent },
      { path: 'area-prioritaria', component: AreaPrioritariaComponent },
      { path: 'linea-investigacion', component: LineaInvestigacionComponent },
      { path: 'dimension-espacial', component: DimensionEspacialComponent },
      { path: 'sujeto-social', component: SujetoSocialComponent },
      { path: 'bulk-import', component: BulkImportComponent },
      { path: 'project', component: ProjectComponent },
      { path: 'teacher', component: TeacherComponent },
      { path: 'academic-year', component: AcademicYearComponent },
      { path: 'project-investigator', component: ProjectInvestigatorComponent },
      { path: 'report-status', component: ReportStatusComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
