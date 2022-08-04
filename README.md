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

## icon font

阿里云图标库下载本地

npm i -g iconfont-tools

 解压下载的文件 进入

 cmd: iconfont-tools

    设置输出文件夹名称: xxx
    设置输出css文件名称: xxx
    设置css文件的prefix: xxx1(就是后面要用的时候 class 的前缀)
    是否生产小程序原生组件: true

然后解压的文件夹里面就会出现一个xxx的文件，打开文件复制xxx.css文件添加到uniapp项目中的static里面

切换到app.vue里面的style下面引入

@import url('~@/static/iconfont-demo-icon.css');

然后就可以在页面通过`<text class="xxx1 xxxx"></text>`引入啦
