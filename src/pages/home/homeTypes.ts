export interface IRoute {
	url?: `/${string}`;
	label: string;
	icon?: string;
	query?: BaseObject;
	description?: string;
  httpUrl?: `http${string}`;
}


export {}