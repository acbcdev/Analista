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
	date: number;
	name: string;
	hour: number;
	minutes: number;
	time: string;
	totalHours: number;
};

export type HoursStorage = {
	createAt: number;
	data: Hours[];
	name: string;
};
export type textCase = "none" | "capitalize" | "capitalizeWords" | "global";
export type emojiPosition = "start" | "end" | "none";
