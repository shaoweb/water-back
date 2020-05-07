import { Component, OnInit } from '@angular/core';
import { RequestService } from '../request.service';
import { Router } from '@angular/router';
import { APIROUTER } from '../mock.api';

import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  constructor(private req: RequestService, private message: NzMessageService, private router: Router) {}

  isLoadingOne:boolean = false;

  // 接口
  routerApi: any = APIROUTER;

  // 登录参数
  parameter: any = {};

  ngOnInit(): void {
    
  }

  submitForm(): void {
    this.isLoadingOne = true;
    setTimeout(() => {
      this.isLoadingOne = false;
    }, 5000);
    this.req.postData(this.routerApi.login, this.parameter).subscribe(res=>{
      // 添加token
      document.cookie='accessToken=' + res['data'];
      // 跳转首页
      this.router.navigateByUrl('/content/engineering');
    },error=>{
      this.message.create('error', error);
    })
  }

}
