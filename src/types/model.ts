import type { Stream } from "./stream";

export type Model = {
  id: string;
  icon: string | React.ElementType; // Icon representing the model
  name: string; // Name of the model
  site: string;
  platform: ModelPlatforms[]; // Platform where the model is active
  streams: Stream[]; // List of streams associated with the model
  retentionRate?: number; // Retention rate of the model
  createdAt: number; // Record creation timestamp
  updatedAt: number; // Last update timestamp
  coversionRate?: number; // Conversion rate of the model
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

type ModelPlatforms = {
  id: Platfoms;
  userName: string;
};

export type Platfoms =
  | "chaturbate"
  | "stripchat"
  | "camsoda"
  | "cherry"
  | "stremate"
  | "cam4"
  | "myfreecams";
