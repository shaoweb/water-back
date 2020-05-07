import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { RequestService } from './request.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
/** 配置 angular i18n **/
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);
import { ContentComponent } from './content/content.component';
import { LoginComponent } from './login/login.component';
import { EngineeringComponent } from './engineering/engineering.component';
import { InformationUpdateComponent } from './information-update/information-update.component';
import { TotalComponent } from './total/total.component';

@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    LoginComponent,
    EngineeringComponent,
    InformationUpdateComponent,
    TotalComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    /** 导入 ng-zorro-antd 模块 **/
    NgZorroAntdModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    RequestService,
    { provide: NZ_I18N, useValue: zh_CN }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
