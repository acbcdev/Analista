import { Platfoms } from "./model";
import type { User } from "./users";

export type Strema = {
	id: string; // Unique identifier for the stream
	views: number; // Total number of views for the stream
	tags: string[]; // List of tags associated with the stream
	title: string; // Title of the stream

	users: User["id"][]; // List of user IDs who participated in the stream
	platform: Platfoms;
	usersPays: User["id"][]; // List of user IDs who paid for the stream
	privates: number; // Number of private sessions during the stream
	userOnlyView: User["id"][]; // List of user IDs who had exclusive access to the stream
	userAnonymousView: number[]; // each 5 minutes
	chatActivity: {
		messages: number; // Total messages sent
		pm: number; // Total private messages sent
	};
	peakHour: number; // Hour with the most activity
	time: {
		start: number; // Start time of the stream
		end: number; // End time of the stream
		day: number; // Day of the stream
		duration: number; // Duration of the stream
	};
	createdAt: number; // Record creation timestamp
	updatedAt: number; // Last update timestamp
	notes: string; // Notes about the stream
};
