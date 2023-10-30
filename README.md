# vue3-vite-ts-uniapp

## icon font

阿里云图标库下载本地

npm i -g iconfont-tools

解压下载的文件 进入

cmd: iconfont-tools

    设置输出文件夹名称: xxx(随意)
    设置输出css文件名称: xxx
    设置css文件的prefix: icon-font(就是后面要用的时候 class 的前缀)
    是否生产小程序原生组件: true

然后解压的文件夹里面就会出现一个 xxx 的文件，打开文件复制 xxx.css 文件添加到 uniapp 项目中的 static 里面

切换到 app.vue 里面的 style 下面引入

@import url('~@/static/iconfont-demo-icon.css');

然后就可以在页面通过`<text class="xxx1 xxxx"></text>`引入啦

```
.icon-font {
 display: inline-block;
 width: 30rpx;
 height: 30rpx;
 background-repeat: no-repeat !important;
 background-position: center;
 background-size: 100% 100%;
}
```

## h5 功能页汇总 默认携带 sysCode herenId patientId 下列参数作为记录 第三方跳转时

| 功能         |                  页面                   | 参数                  |
| :----------- | :-------------------------------------: | :-------------------- |
| 健康咨询     |  pagesA/healthAdvisory/healthAdvisory   | sysCode               |
| 用药提醒     | pagesC/medicationManager/medicationList | sysCode token herenId |
| 服务电话     |        pages/helplines/helplines        | sysCode               |
| 预问诊       |        pages/inquiries/inquiries        | sysCode token         |
| 医院指南     |    pages/hospitalGuide/hospitalGuide    | sysCode hosId         |
| 用药提醒     | pagesC/medicationManager/medicationList | sysCode token herenId |
| 我的医生     |        pagesC/myDoctor/myDoctor         | sysCode token herenId |
| 核酸结果查询 |     pagesC/mixCheckResult/hsResult      | sysCode token herenId |
| 电子发票 |     pagesA/eletronicInvoice/eletronicInvoice      | sysCode token herenId |
| 渭南健康打卡 |     pagesC/choosePat/choosePat      | sysCode token herenId _type=weinandk |

## 单独 2.0 迁移 3.0 的

测试环境 <https://health.eheren.com/V3_h5/#/>
正式环境 <https://h5.eheren.com/V3_h5/>#

| 功能     |                    页面                     | 参数          |
| :------- | :-----------------------------------------: | :------------ |
| 健康自测 |    pagesA/healthSelfTest/healthSelfTest     |               |
| 药品百科 | pages/drugsEncyclopedias/drugsEncyclopedias |               |
| 疾病百科 |       pagesA/diseaseCyclopedia/index        | sysCode       |
| otc 商城 |                    暂无                     | sysCode token |

---

## warn

### 如需安装新依赖

需要 切换 node@15.14.0 (否则后面爆炸)
    nom i packageName

### 如需重新下载 node_modules

需要 切换 node@15.14.0
    npm i
切换 node@16.15.0
    npm install terser

## 公共页面

- 跳转小程序

    pagesC/openMiniProgram
    > 无法在小程序外部的环境下控制程序直接跳转, 此时跳到此页面由小程序来调用 navigateToMiniProgram api 进行跳转

- 互联网医院

    pagesC/commonHosNet
    > 需要去互联网医院的某页面使用

- webview

    pagesA/webView/webView
