import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TotalComponent } from './total/total.component';
import { LoginComponent } from './login/login.component';
import { ContentComponent } from './content/content.component';
import { EngineeringComponent } from './engineering/engineering.component';
import { InformationUpdateComponent } from './information-update/information-update.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'content', component: ContentComponent, children:[
    { path: '', redirectTo: '/content/total', pathMatch: 'full'},
    { path: 'total', component: TotalComponent },
    { path: 'engineering', component: EngineeringComponent },
    { path: 'informationupdate', component: InformationUpdateComponent }
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
