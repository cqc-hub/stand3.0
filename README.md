# vue3-vite-ts-uniapp

## 项目技术栈

    Vue3
    Vite
    TypeScript
    Pinia

## 安装 eslint+prettier 统一编码规范

代码保存就会自动格式化代 <https://www.cnblogs.com/sugartang/p/16464587.html>

## 配置项目别名

resolve: {
alias: [
{
find: '@',
replacement: resolve(__dirname, 'src'),
},
],
},

## 安装

cnpm i

## 更新最新正式版本的编译器

npx @dcloudio/uvm

## git 提交规范

feat 增加新功能
fix 修复问题/BUG
style 代码风格相关无影响运行结果的
perf 优化/性能提升
refactor 重构
revert 撤销修改
test 测试相关
docs 文档/注释
chore 依赖更新/脚手架配置修改等
workflow 工作流改进
ci 持续集成
types 类型定义文件更改
wip 开发中

## icon font

阿里云图标库下载本地

npm i -g iconfont-tools

解压下载的文件 进入

cmd: iconfont-tools

    设置输出文件夹名称: xxx
    设置输出css文件名称: xxx
    设置css文件的prefix: xxx1(就是后面要用的时候 class 的前缀)
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

## 开发规范

网络请求图片大小控制在 100k 以内 建议 svg 或 webP 格式
尽量减少用同步的方式缓存
减少重复的 JSAPI 调用
