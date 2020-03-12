import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ContentComponent } from './content/content.component';
import { EngineeringComponent } from './engineering/engineering.component';
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'content', component: ContentComponent, children:[
    { path: '', redirectTo: '/content/engineering', pathMatch: 'full'},
    { path: 'engineering', component: EngineeringComponent }
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
