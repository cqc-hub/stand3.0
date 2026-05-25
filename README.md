# vue3-vite-ts-uniapp

## Icon Font 配置

### 安装工具

```bash
npm i -g iconfont-tools
```

### 使用步骤

1. 从阿里云图标库下载图标文件并解压
2. 进入解压后的文件夹，执行命令：

```bash
iconfont-tools
```

3. 按提示配置：
   - 设置输出文件夹名称：`xxx`（随意）
   - 设置输出 CSS 文件名称：`xxx`
   - 设置 CSS 文件的 prefix：`icon-font`（class 的前缀）
   - 是否生成小程序原生组件：`true`

4. 将生成的 `xxx.css` 文件复制到 uniapp 项目的 `static` 目录

5. 在 `App.vue` 的 `<style>` 中引入：

```css
@import url('~@/static/iconfont-demo-icon.css');
```

6. 在页面中使用：

```html
<text class="icon-font xxx1"></text>
```

### 样式示例

```css
.icon-font {
  display: inline-block;
  width: 30rpx;
  height: 30rpx;
  background-repeat: no-repeat !important;
  background-position: center;
  background-size: 100% 100%;
}
```

---

## H5 功能页汇总

> 默认携带 `sysCode`、`herenId`、`patientId` 参数，用于第三方跳转记录

| 功能         | 页面路径                                     | 参数                              |
| :----------- | :------------------------------------------- | :-------------------------------- |
| 健康咨询     | `pagesA/healthAdvisory/healthAdvisory`       | `sysCode`                         |
| 用药提醒     | `pagesC/medicationManager/medicationList`    | `sysCode` `token` `herenId`       |
| 服务电话     | `pages/helplines/helplines`                  | `sysCode`                         |
| 预问诊       | `pages/inquiries/inquiries`                  | `sysCode` `token`                 |
| 医院指南     | `pages/hospitalGuide/hospitalGuide`          | `sysCode` `hosId`                 |
| 我的医生     | `pagesC/myDoctor/myDoctor`                   | `sysCode` `token` `herenId`       |
| 核酸结果查询 | `pagesC/mixCheckResult/hsResult`             | `sysCode` `token` `herenId`       |
| 电子发票     | `pagesA/eletronicInvoice/eletronicInvoice`   | `sysCode` `token` `herenId`       |
| 渭南健康打卡 | `pagesC/choosePat/choosePat`                 | `sysCode` `token` `herenId` `_type=weinandk` |

---

## 2.0 迁移到 3.0 的功能

### 环境地址

- **测试环境**：https://health.eheren.com/V3_h5/#/
- **正式环境**：https://h5.eheren.com/V3_h5/#/

### 功能列表

| 功能     | 页面路径                                 | 参数              |
| :------- | :--------------------------------------- | :---------------- |
| 健康自测 | `pagesA/healthSelfTest/healthSelfTest`   | -                 |
| 药品百科 | `pages/drugsEncyclopedias/drugsEncyclopedias` | -            |
| 疾病百科 | `pagesA/diseaseCyclopedia/index`         | `sysCode`         |
| OTC 商城 | 暂无                                     | `sysCode` `token` |

---

## 开发环境要求

### Node 版本

- **Node**：v16.15.0
- **npm**：8.5.5

### npm 源配置

```bash
# 查看当前源
npm config get registry

# 设置为淘宝镜像源
npm set registry https://registry.npmmirror.com/
```

---

## 公共页面

### 跳转小程序

**路径**：`pagesC/openMiniProgram`

> 无法在小程序外部的环境下直接跳转，需跳转到此页面，由小程序调用 `navigateToMiniProgram` API 进行跳转

### 互联网医院

**路径**：`pagesC/commonHosNet`

> 需要跳转到互联网医院的某个页面时使用

### WebView

**路径**：`pagesA/webView/webView`

---

## 智能助医 H5 版本

**访问地址**：https://h5.eheren.com/v3_mini/#/pagesA/intelMedicalAssist/intelMedicalAssist?sysCode=1001039

**打包注意事项**：
- `pages.json` 中只保留 `intelMedicalAssist/intelMedicalAssist` 路径
- 打包时需将顶部医院名称置空

---

## 新医院上线检查清单

- [ ] 是否完善授权模式
- [ ] 报告是否支持下载
- [ ] 修改手机号的 OCR 识别（禁止后端接口模式）

## 代码混淆

- 打包后，单独执行dev:obfuscate进行混淆，暂支持微信
- 脚本文件：obfuscate.js 
- 配置文件：obfuscator-config.json