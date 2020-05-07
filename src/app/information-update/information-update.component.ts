import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

import { APIROUTER } from '../mock.api';
import { RequestService } from "../request.service";

@Component({
  selector: 'app-information-update',
  templateUrl: './information-update.component.html',
  styleUrls: ['./information-update.component.css']
})
export class InformationUpdateComponent implements OnInit {

  constructor(private req: RequestService, private activatedRoute: ActivatedRoute, private router: Router, private message: NzMessageService) { }

  // 获取api接口
  routerApi: any = APIROUTER;

  // 总数据
  information: any = {};

  ngOnInit() {

    // 根据url的参数，查询该项目详情
    this.activatedRoute.queryParams.subscribe(queryParam => {
      let currentId = queryParam.id;
      this.req.postData(this.routerApi.getProject, {'id':currentId}).subscribe(res=>{
        this.information = res['data'];
      },error=>{
        this.message.create('error', error)
      })
    })
  };

  // 表格历次维修加固信息新增，表格历次工程险情信息新增
  paremeterAdd(type: any):void{
    switch(type){
      case 1:
        this.information.ms.push({'date':'', 'reason': ''});
        break;
      case 2:
        this.information.ds.push({'date':'', 'content': ''});
        break;
    }
  };

  // 表格历次维修加固信息删除，表格历次工程险情信息删除
  parementerRemove(type: any, index:any):void{
    switch(type){
      case 1:
        this.information.ms.splice(index,1);
        break;
      case 2:
        this.information.ds.splice(index,1);
        break;
    }
  };

}
