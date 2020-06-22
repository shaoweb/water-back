import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzCascaderOption } from 'ng-zorro-antd/cascader';

import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../request.service';
import { APIROUTER, ClusterThe } from '../mock.api';
import { resolve } from 'url';

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
  values: string[] | null = null;
  levelThree: any = {};

  // 当前选中的数据,某个项目的详情
  currentData: any = {};
  projectInformation: any = {};

  // 省市区
  provinceCityArea: any = {};

  // 下拉列表
  can: any = ['A类', 'B类', 'C类'];
  partSite: any = {
    '上游连接段': ['上游护坡', '海漫', '两岸翼墙', '护坦', '消力池', '上游防冲槽'],
    '下游连接段': ['翼墙', '铺盖', '护底', '下游防冲槽', '下游护坡'],
    '闸室': ['交通桥', '闸门', '底板', '闸墩', '启闭机', '工作桥', '胸墙']
  }

  // 工程现状新增参数，工程险情新增参数，工程修改/加固新增参数，安全监测新增参数，安全复核新增参数，工程档案新增参数
  statusParameter: any = { 'type': '现状调查' };
  dangerParameter: any = {};
  strengtheningPar: any = {};
  inspectionParameter: any = {};
  securitycheckPar: any = { 'type': '安全复核' };
  archivesParameter: any = {};

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
  imagesDelect: boolean = false;
  projectModify: boolean = false;
  videoAddmodify: boolean = false;
  archivesAdd: boolean = false;

  // 查询到安全检测的的值
  securityData: any;

  // 接收上传的图片的数据，接收上传的视频的数据
  fileList = [];
  videoList = [];

  // 上传图片/视频的参数配置
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

    // 查询行政区
    this.req.getData(this.routerApi.getArea).subscribe(res => {
      this.levelThree['province'] = res['data'];
    }, error => {
      this.message.create('error', error);
    })

    // 默认回调
    this.total(this.parameter);

  }

  // 选择地区
  onChanges(values: string[]): void {
    console.log(values);
  };

  // 点击查询市区
  onExpandChange(currentId: any): void {
    this.req.getData(this.routerApi.getArea, { 'parentId': currentId }).subscribe(res => {
      this.levelThree.city = res['data'];
    }, error => {
      this.message.create('error', error);
    })
  };

  // 点击查询县级
  onChangeCounty(currentId: any): void {
    this.req.getData(this.routerApi.getArea, { 'parentId': currentId }).subscribe(res => {
      this.levelThree.area = res['data'];
    }, error => {
      this.message.create('error', error);
    })
  };

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

  // 条件查询
  searchAll(): void {
    this.currentData = {};
    this.parameter.page = 1;
    this.parameter.count = 10;
    this.parameter.areasId = this.provinceCityArea.area | this.provinceCityArea.city | this.provinceCityArea.province;
    this.parameter.buildTime = this.clusterThe.currentDate(this.parameter.buildTime, 'yyyy-MM-dd');
    this.total(this.parameter);
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
  modalSelect(type: any, data?: any): void {
    data ? this.currentData = data : null;
    if (this.currentData.id) {
      switch (type) {
        case 0:
          this.informationModle = true;
          break;
        case 1:
          this.statusquoAdd = true;
          this.statusParameter['wcpId'] = this.currentData['id'];
          break;
        case 2:
          this.dangerAdd = true;
          this.dangerParameter['proId'] = this.currentData['id'];
          break;
        case 3:
          this.strengtheningAdd = true;
          break;
        case 4:
          this.inspectionAdd = true;
          this.inspectionParameter['wcpId'] = this.currentData['id'];
          break;
        case 5:
          this.securityCheck = true;
          this.securitycheckPar['wcpId'] = this.currentData['id'];
          break;
        case 6:
          this.securitycheckModle = true;
          this.securitySearch(this.currentData['id']);
          break;
        case 7:
          this.customModify = true;
          break;
        case 8:
          this.imagesDelect = true;
          this.information(this.currentData.id);
          break;
        case 9:
          this.projectModify = true;
          this.information(data.id);
          break;
        case 10:
          this.videoAddmodify = true;
          break;
        case 11:
          this.archivesAdd = true;
          break;
      }
    } else {
      this.message.create("warning", "请选择要操作的数据")
    }
  };

  // 工程现状新增
  statusquoSubmit(): void {
    this.statusquoAdd = false;
    let describe = [];
    switch (this.statusParameter.value) {
      case '有':
        this.statusParameter.value = true;
        describe = ['有', '无'];
        this.statusParameter.describe = describe.join('、');
        break;
      case '无':
        this.statusParameter.value = false;
        describe = ['有', '无'];
        this.statusParameter.describe = describe.join('、');
        break;
      case 'A级':
        this.statusParameter.value = false;
        describe = ['A级', 'B级', 'C级'];
        this.statusParameter.describe = describe.join('、');
        this.statusParameter.value = this.statusParameter.value;
        break;
      case 'B级':
        this.statusParameter.value = false;
        describe = ['A级', 'B级', 'C级'];
        this.statusParameter.describe = describe.join('、');
        this.statusParameter.value = this.statusParameter.value;
        break;
      case 'C级':
        this.statusParameter.value = false;
        describe = ['A级', 'B级', 'C级'];
        this.statusParameter.describe = describe.join('、');
        this.statusParameter.value = this.statusParameter.value;
        break;
      default:
        describe = ['规范', '较规范', '不规范'];
        this.statusParameter.describe = describe.join('、');
        this.statusParameter.value = this.statusParameter.value;
        break;
    };
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
    this.req.postData(this.routerApi.updateProject, this.currentData).subscribe(res => {
      this.message.create('success', '操作成功');
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
      this.securityData = res['data'];
    }, error => {
      this.message.create('error', error);
    })
  };

  // 查询详情
  information(projectId: string): void {
    this.req.postData(this.routerApi.getProject, { 'id': projectId }).subscribe(res => {
      this.projectInformation = res['data'];
      console.log(this.projectInformation);
    }, error => {
      this.message.create('error', error);
    })
  }

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

  // 删除图片
  delectImage(url: string, pid: string): void {
    this.req.getData(this.routerApi.deleteImg, { 'img': url, 'pid': pid }).subscribe(res => {
      let index = this.projectInformation.imgs.indexOf(url);
      this.projectInformation.imgs.splice(index, 1);
      this.message.create('success', '操作成功');
    }, error => {
      this.message.create('error', error);
    })
  };

  // 上传视频
  videoAddSubmit(): void {
    // 遍历视频的地址
    let arr = [];
    this.videoList.forEach(item => {
      if (item['response']) {
        let imgUrl = item['response']['data'].split('wcpimg');
        arr.push('/wcpimg' + imgUrl[1]);
      }
    })
    this.currentData.video = arr.join(',');
    this.req.postData(this.routerApi.updateProject, this.currentData).subscribe(res => {
      this.videoAddmodify = false;
      this.message.create('success', '操作成功');
    }, error => {
      this.message.create('error', error);
    })
  };

  // 工程档案新增
  archiveSumbit(): void {
    let data = { 'title': this.archivesParameter.title, 'content': this.archivesParameter.content, 'state': 4, 'pid': this.currentData.id};
    this.req.postData(this.routerApi.addRecord, data).subscribe(res => {
      this.archivesAdd = false;
      this.archivesParameter = {};
      this.message.create('success', '添加成功');
    }, error => {
      this.message.create('error', error);
    })
  };

}
