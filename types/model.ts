import { Strema } from "./stream";

export type Model = {
  id: string;
  icon: string | React.ElementType; // Icon representing the model
  name: string; // Name of the model
  site: string;
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

export type Admin = {
  id: string; // Unique identifier for the admin
  name: string; // Name of the admin
  email: string; // Email address of the admin
  password: string; // Password for the admin account
  createdAt: number; // Record creation timestamp
  updatedAt: number; // Last update timestamp
  icon: React.ElementType; // Icon representing the admin
};

export type Platfoms = "chaturbate" | "stripchat" | "camsoda";
