export type Tags = {
	tag: string;
	viewers: number;
	rooms: number;
	avgViewersPerRoom: number;
	roomSharePct: number;
	viewerSharePct: number;
	demandIndex: number;
};

export type TagsStorage = {
	createAt: number;
	data: string[];
	name: string;
};

export type Hours = {
	date: Date;
	name: string;
	hour: number;
	minutes: number;
	time: string;
};

export type HoursStorage = {
	createAt: number;
	data: Hours[];
	name: string;
};
