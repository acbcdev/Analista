import { Strema } from "./stream";

export type Model = {
  id: string;
  cbUsername: string; // Username on Chaturbate
  scUsername: string; // Username on Stripchat
  csUsername: string; // Username on Camsoda
  platform: Platfoms[]; // Platform where the model is active
  cbStreams: Strema[]; // List of streams on Chaturbate
  scStreams: Strema[]; // List of streams on Stripchat
  csStreams: Strema[]; // List of streams on Camsoda
  retentionRate: number; // Retention rate of the model
  createdAt: number; // Record creation timestamp
  updatedAt: number; // Last update timestamp
  coversionRate: number; // Conversion rate of the model
};

export type Platfoms = "chaturbate" | "stripchat" | "camsoda";
