### 线上预览
![image](https://masteryi-localhost.oss-cn-hangzhou.aliyuncs.com/uni-app/yi-code-qrcode.png)

### 使用方法
`<yi-code @onComplete="complete" @onChange="change"></yi-code>`

### 参数

| 属性            | 类型             | 说明                                | 默认值    |
|---------------|----------------|-----------------------------------|--------|
| width         | number         | 宽度 rpx                            | 500    |
| maxlength     | number         | 验证码长度                             | 6      |
| focus         | boolean        | 是否自动聚焦                            | true   |
| type          | pane、line      | 组件风格支持block方框, dashed 虚线方框，line 线 | block  |
| inputType     | text、number    | 输入框类型 支持text、number               | number |
| @onComplete    | (code: string) |  输入长度===maxlength时的完成回调onComplete            |   null     |
| @onChange      | (code: string) |  code值变更回调onChange                         |   null     |
| clear      | ref function |  清除输入内容                      |        |

### 个人博客
[www.masteryi.cn](https://www.masteryi.cn)  

### 示例代码
```
<template>
	<view class="page">
		<view class="card">
			<view class="title">block</view>
			<view><button @click="onClear" style="background: #ff5500; color: #fff;">清除内容</button></view>
			<view class="body">
				<yi-code ref="code" :width="600" @onComplete="complete" @onChange="change"></yi-code>
			</view>
		</view>
		
		<view class="card">
			<view class="title">dashed</view>
			<view class="body">
				<yi-code :focus="false" :maxlength="5" type="dashed"></yi-code>
			</view>
		</view>
		
		<view class="card">
			<view class="title">line</view>
			<view class="body">
				<yi-code :focus="false" :maxlength="4" type="line"></yi-code>
			</view>
		</view>
	</view>
</template>

<script>
	// 注意测试案例的时候 focus只保持一个自动聚焦， 其他设置false，防止调试输入不了；
	
	export default {
		data() {
			return {
			}
		},
		onLoad() {
			
		},
		methods: {
			onClear(){
				this.$refs.code.clear()	
			},
			complete(code){
				console.log(`complete:${code}`);
			},
			change(code){
				console.log(`change:${code}`);
			}
		}
	}
</script>

<style lang="scss">
	.page {
		display: flex;
		flex-wrap: wrap;
		.card{
			width: 720rpx;
			margin: 30rpx auto;
			border: 1px solid #f0f0f0;
			border-radius: 12rpx;
			
			.title{
				font-size: 14px;
				text-align: center;
				line-height: 30px;
				border-bottom: 1px solid #f0f0f0;
			}
			
			.body{
				display: flex;
				align-items: center;
				justify-content: center;
				height: 150rpx;
			}
		}
	}
</style>
```