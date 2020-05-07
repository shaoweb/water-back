import { Component, OnInit } from '@angular/core';

import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';

import { RequestService } from '../request.service';
import { APIROUTER, ClusterThe } from '../mock.api';


@Component({
  selector: 'app-engineering',
  templateUrl: './engineering.component.html',
  styleUrls: ['./engineering.component.css']
})
export class EngineeringComponent implements OnInit {

  constructor(private req: RequestService, private message: NzMessageService) { }

  // 接口api
  routerApi: any = APIROUTER;

  // 公用方法
  clusterThe: any = new ClusterThe();

  // 按钮是否可以点击
  isLoadingOne = false;

  // 工程类型
  endinerrType: any;

  // 时间选择
  buildTime: any;

  // 添加数据
  data: any = {'ms':[{'date':'', 'reason': ''}], 'ds':[{'date':'', 'content': ''}]};

  // 省，市，区（县）的数据
  levelThree: any = {};

  // 当前省，市区，县的ID
  currentProvince: any;
  currentCity: any;
  currentCounty: any;

  // 图片上传
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };

  fileList = [];
  previewImage: string | undefined = '';
  previewVisible = false;

  ngOnInit(): void {

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
  };
  
  // 表格历次维修加固信息新增，表格历次工程险情信息新增
  paremeterAdd(type: any):void{
    switch(type){
      case 1:
        this.data.ms.push({'date':'', 'reason': ''});
        break;
      case 2:
        this.data.ds.push({'date':'', 'content': ''});
        break;
    }
  };

  // 表格历次维修加固信息删除，表格历次工程险情信息删除
  parementerRemove(type: any, index:any):void{
    switch(type){
      case 1:
        this.data.ms.splice(index,1);
        break;
      case 2:
        this.data.ds.splice(index,1);
        break;
    }
  };

  // 点击查询市区
  onExpandChange(currentId:any): void {
    this.currentCity = null;
    this.currentCounty = null;
    this.req.getData(this.routerApi.getArea, { 'parentId': currentId }).subscribe(res => {
      this.levelThree['cityThe'] = res['data'];
    }, error => {
      this.message.create('error', error);
    })
  };

  // 点击查询县级
  onChangeCounty(currentId:any): void{
    this.currentCounty = null;
    this.req.getData(this.routerApi.getArea, { 'parentId': currentId }).subscribe(res => {
      this.levelThree['county'] = res['data'];
    }, error => {
      this.message.create('error', error);
    })
  };

  // 点击查看图片详情
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  // 点击提交
  loadOne(): void {
    this.isLoadingOne = true;
    // 遍历图片的地址
    let arr = [];
    for(let item in this.fileList){
      let imgUrl = this.fileList[item]['response']['data'].split('wcpimg');
      arr.push('/wcpimg' + imgUrl[1]);
    }
    // 日期格式化
    for(let item in this.data.ms){
      this.data.ms[item]['date'] = this.clusterThe.currentDate(this.data.ms[item]['date'], 'yyyy-MM-dd');
    }
    for(let item in this.data.ds){
      this.data.ds[item]['date'] = this.clusterThe.currentDate(this.data.ds[item]['date'], 'yyyy-MM-dd');
    }
    this.data.buildTime = this.clusterThe.currentDate(this.buildTime, 'yyyy-MM-dd');
    // 数组转换
    this.data.img = arr.join(',');
    // 逐级赋值
    this.data.areasId = this.currentCounty || this.currentCity || this.currentProvince;
    this.req.postData(this.routerApi.addProject, this.data).subscribe(res => {
      this.message.create('success', '添加成功');
      this.isLoadingOne = false;
    }, error => {
      this.isLoadingOne = false;
      this.message.create('error', `${error}`);
    })
  };

  // Excel模板下载
  excelSumbit(): void{
    window.open(this.routerApi.exportPro);
    // this.req.getData(this.routerApi.exportPro).subscribe(res=>{
    //   this.message.create('success', '模板开始下载，请在浏览器下载列查看下载进度')
    // },error=>{
    //   this.message.create('error',error);
    // })
  }

  // 上传Excel的回调
  uploadChang(event: any): void{
    if(event.fileList.length > 0){
      if(event.fileList[0]['response']){
        this.message.create('', event.fileList[event.fileList.length - 1]['response']['message'])
      }
    }
  }

}
