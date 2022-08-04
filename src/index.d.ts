/// <reference path="@dcloudio/types/uni-app/uni.d.ts" />

interface BaseObject {
	[key: string]: any;
}

// declare module 'js_sdk/crazy-router'

declare namespace UniNamespace {
	interface NavigateToOptions {
		passedParams?: {
			[key: string]: any;
		};
	}
}
