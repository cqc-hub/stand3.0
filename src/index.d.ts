 interface BaseObject {
	[key: string]: any
}

// declare module 'uni-crazy-router'

 declare namespace UniNamespace {
	interface NavigateToOptions {
		passedParams?: {
			[key: string]: any
		}
	}
}