import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadFile } from 'ng-zorro-antd/upload';

import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../request.service';
import { APIROUTER, ClusterThe } from '../mock.api';

@Component({
  selector: 'app-total',
  templateUrl: './total.component.html',
  styleUrls: ['./total.component.css']
})
export class TotalComponent implements OnInit {

  constructor(private req: RequestService, private message: NzMessageService, private router: Router) { }

  // 接口api
  routerApi: any = APIROUTER;

  // 公用方法
  clusterThe: any = new ClusterThe();

  // 查询参数
  parameter: any = { 'page': 1, 'count': 10 };

  // 下拉列表
  can: any = ['A类', 'B类', 'C类'];
  describe: any = ['规范', '较规范', '不规范', '有', '无'];
  partSite: any = {
    '上游连接段': ['护坡', '海漫', '两岸翼墙', '护坦', '消力池', '防冲槽'],
    '下游连接段': ['翼墙', '铺盖', '护底', '防冲槽', '护坡'],
    '闸室': ['交通桥', '闸门', '底板', '闸墩', '启闭机', '工作桥', '胸墙']
  }

  // 工程现状新增参数，工程险情新增参数，工程修改/加固新增参数，安全监测新增参数，安全复核新增参数
  statusParameter: any = { 'type': '现状调查' };
  dangerParameter: any = {};
  strengtheningPar: any = {};
  inspectionParameter: any = {};
  securitycheckPar: any = { 'type': '安全复核' };

  // 总数据
  totalData: any;

  // 总页数
  totalItems: any;

  // 工程类型
  endinerrType: any;

  // 弹框类型
  informationModle: boolean = false;
  statusquoAdd: boolean = false;
  dangerAdd: boolean = false;
  strengtheningAdd: boolean = false;
  inspectionAdd: boolean = false;
  securityCheck: boolean = false;
  securitycheckModle: boolean = false;
  customModify: boolean = false;

  // 当前选中的数据
  currentData: any = {};

  // 查询到安全检测的的值
  securityData: any;

  // 接收上传的图片的数据
  fileList = [];

  // 上传图片的参数配置
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };

  previewImage: string | undefined = '';
  previewVisible = false;

  ngOnInit() {

    // 获取工程类型
    this.req.getData(this.routerApi.getWcp).subscribe(res => {
      this.endinerrType = res['data'];
    }, error => {
      this.message.create('error', error);
    })

    // 默认回调
    this.total(this.parameter);

  }

  // 查询所有数据
  total(data: any): void {
    this.req.postData(this.routerApi.getProjects, data).subscribe(res => {
      for (let item in res['data']) {
        res['data'][item]['typeName'] = this.screening(res['data'][item]['type']);
      }
      this.totalData = res['data'];
      this.totalItems = res['count'];
    }, error => {
      this.message.create('error', `${error}`);
    })
  };

  // 筛选出工程类型的名字
  screening(typeId: any): string {
    let name = '';
    for (let item in this.endinerrType) {
      if (this.endinerrType[item]['id'] == typeId) {
        name = this.endinerrType[item]['name'];
        return name;
      }
    }
    return name;
  };

  // 分页
  searchData($event: any): void {
    this.parameter.page = $event;
    this.total(this.parameter);
  };

  // 修改每页展示的条数
  pageSizeChange($event: any): void {
    this.parameter.count = $event;
    this.total(this.parameter);
  };

  // 弹框选择
  modalSelect(item: any, type: any): void {
    switch (type) {
      case 0:
        this.informationModle = true;
        this.currentData = item;
        break;
      case 1:
        this.statusquoAdd = true;
        this.statusParameter['wcpId'] = item['id'];
        break;
      case 2:
        this.dangerAdd = true;
        this.dangerParameter['proId'] = item['id'];
        break;
      case 3:
        this.strengtheningAdd = true;
        break;
      case 4:
        this.inspectionAdd = true;
        this.inspectionParameter['wcpId'] = item['id'];
        break;
      case 5:
        this.securityCheck = true;
        this.securitycheckPar['wcpId'] = item['id'];
        break;
      case 6:
        this.securitycheckModle = true;
        this.securitySearch(item['id']);
        break;
      case 7:
        this.customModify = true;
        this.currentData = item;
        break;
    }
  };

  // 工程现状新增
  statusquoSubmit(): void {
    this.statusquoAdd = false;
    switch (this.statusParameter.value) {
      case '有':
        this.statusParameter.value = true;
        break;
      case '无':
        this.statusParameter.value = false;
        break;
      default:
        this.statusParameter.value = this.statusParameter.value;
        break;
    };
    this.statusParameter.describe = this.describe.join('、');
    this.req.postData(this.routerApi.addPara, this.statusParameter).subscribe(res => {
      if (res['count'] == 0) {
        this.message.create('success', '操作成功');
      }
    }, error => {
      this.message.create('error', error)
    })

  };

  // 工程险情新增
  dangerSubmit(): void {
    this.dangerAdd = false;
    this.dangerParameter.date = this.clusterThe.currentDate(this.dangerParameter.date, 'yyyy-MM-dd');
    this.req.postData(this.routerApi.addDanger, this.dangerParameter).subscribe(res => {
      if (res['count'] == 0) {
        this.message.create('success', '操作成功');
      }
    }, error => {
      this.message.create('error', error);
    })
  };

  // 维修加固新增
  strengtheningSubmit(): void {
    this.strengtheningAdd = false;
    this.strengtheningPar.date = this.clusterThe.currentDate(this.strengtheningPar.date, 'yyyy-MM-dd');
    this.req.postData(this.routerApi.addMaintain, this.strengtheningPar).subscribe(res => {
      if (res['count'] == 0) {
        this.message.create('success', '操作成功');
      }
    }, error => {
      this.message.create('error', error);
    })
  };

  // 编辑
  editorSumbit(): void {
    this.informationModle = false;
    this.currentData.buildTime = this.clusterThe.currentDate(this.currentData.buildTime, 'yyyy-MM-dd');
    this.req.postData(this.routerApi.updateProject, this.currentData).subscribe(res => {
      if (res['count'] == 0) {
        this.message.create('success', '操作成功');
      }
    }, error => {
      this.message.create('error', error);
    })
  };

  // 安全检测新增
  inspectionSumbit(): void {
    this.inspectionAdd = false;
    this.req.postData(this.routerApi.addStru, this.inspectionParameter).subscribe(res => {
      if (res['count'] == 0) {
        this.message.create('success', '操作成功');
      }
    }, error => {
      this.message.create('error', error);
    })
  };

  // 安全复核新增
  securitycheckSumbit(): void {
    this.securityCheck = false;
    this.securitycheckPar.can = this.can.join('、');
    this.req.postData(this.routerApi.addPara, this.securitycheckPar).subscribe(res => {
      if (res['count'] == 0) {
        this.message.create('success', '操作成功');
      }
    }, error => {
      this.message.create('error', error);
    })
  };

  // 查询安全检测
  securitySearch(id: any): void {
    this.req.getData(this.routerApi.getStruValue, { 'wcpId': id }).subscribe(res => {
      console.log(res);
      this.securityData = res['data'];
    }, error => {
      this.message.create('error', error);
    })
  };

  // 图片选中回调
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  // 图片新增
  imgaddSubmit(): void {
    // 遍历图片的地址
    let arr = [];
    this.fileList.forEach(item => {
      if (item['response']) {
        let imgUrl = item['response']['data'].split('wcpimg');
        arr.push('/wcpimg' + imgUrl[1]);
      }
    })
    this.currentData.img = arr.join(',');
    this.req.postData(this.routerApi.updateProject, this.currentData).subscribe(res => {
      this.customModify = false;
      this.message.create('success', '操作成功');
    }, error => {
      this.message.create('error', error);
    })
  };

}
