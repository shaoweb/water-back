import { Component, OnInit } from '@angular/core';
import { UploadFile } from 'ng-zorro-antd/upload';
import { RequestService } from '../request.service';
import { APIROUTER } from '../mock.api';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as $ from 'jquery';

@Component({
  selector: 'app-engineering',
  templateUrl: './engineering.component.html',
  styleUrls: ['./engineering.component.css']
})
export class EngineeringComponent implements OnInit {

  constructor(private req: RequestService, private message: NzMessageService) { }

  // 接口api
  routerApi: any = APIROUTER;
  customModify:boolean = false;

  // 按钮是否可以点击
  isLoadingOne = false;

  // 添加数据
  data: any = {};

  // 省市区三级联动
  options = [
    {
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [
        {
          value: 'hangzhou',
          label: 'Hangzhou',
          children: [
            {
              value: 'xihu',
              label: 'West Lake',
              isLeaf: true
            }
          ]
        },
        {
          value: 'ningbo',
          label: 'Ningbo',
          isLeaf: true
        }
      ]
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [
        {
          value: 'nanjing',
          label: 'Nanjing',
          children: [
            {
              value: 'zhonghuamen',
              label: 'Zhong Hua Men',
              isLeaf: true
            }
          ]
        }
      ]
    }
  ];
  
  otherOptions = [
    {
      value: 'fujian',
      label: 'Fujian',
      children: [
        {
          value: 'xiamen',
          label: 'Xiamen',
          children: [
            {
              value: 'Kulangsu',
              label: 'Kulangsu',
              isLeaf: true
            }
          ]
        }
      ]
    },
    {
      value: 'guangxi',
      label: 'Guangxi',
      children: [
        {
          value: 'guilin',
          label: 'Guilin',
          children: [
            {
              value: 'Lijiang',
              label: 'Li Jiang River',
              isLeaf: true
            }
          ]
        }
      ]
    }
  ];

  nzOptions: any[] | null = null;
  values: any[] | null = null;

  // 图片上传
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  fileList = [
  ];
  previewImage: string | undefined = '';
  previewVisible = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.nzOptions = this.options;
    }, 100);

    // 获取工程类型
    this.req.getData(this.routerApi.getWcp).subscribe(res=>{
      console.log(res);
    },error=>{
      this.message.create('error',error);
    })
  }

  // 省市区三级联动选择
  changeNzOptions(): void {
    if (this.nzOptions === this.options) {
      this.nzOptions = this.otherOptions;
    } else {
      this.nzOptions = this.options;
    }
  }

  // 回显
  onChanges(values: any): void {
    console.log(values, this.values);
  }

  // 图片回显
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
    console.log(this.fileList);
  };

  // 点击提交
  loadOne(): void {
    this.isLoadingOne = true;
    this.customModify = true;
    setTimeout(() => {
      this.isLoadingOne = false;
    }, 5000);
  }



}
