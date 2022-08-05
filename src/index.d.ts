/// <reference path="@dcloudio/types/uni-app/uni.d.ts" />

interface BaseObject {
	[key: string]: any;
}

interface IRoute {
	url?: `/${string}`;
	label: string;
	icon?: string;
	query?: BaseObject;
	description?: string;
	httpUrl?: `http${string}`;
}

// declare module 'js_sdk/crazy-router'

// declare namespace UniNamespace {
// 	interface NavigateToOptions {
// 		passedParams?: {
// 			[key: string]: any;
// 		};
// 	}
// }
