import type { Platfoms } from "./model";

export type User = {
  id: string; // Unique user identifier
  username: string; // Username on the platform
  platform: Platfoms; // Platform where the user was seen
  userLevel: string; // User level or status (e.g., 'fan', 'VIP')
  accountAge: string; // How long the account has existed
  firstSeen: number; // Primera vez que se vio al usuario
  lastSeen: number; // Última actividad registrada
  totalVisits: number; // Número de veces que ha visitado
  totalTimeSpent: number;
  totalTips: number; // Número total de tips dados
  totalAmountTipped: number; // Cantidad total en tokens/credits
  averageTip: number; // Promedio de tip
  largestTip: number; // Tip más grande dado
  tipFrequency: string;
  isRegular: boolean; // Si es usuario recurrente
  isBigTipper: boolean; // Si da tips grandes (configurable)
  engagement: {
    messagesCount: Number; // Número de mensajes enviados
    reactionsCount: Number; // Reacciones/emojis enviados
    requestsCount: Number; // Número de requests hechos
  };
  location: {
    country: String; // Si es detectable por la plataforma
    timezone: String; // Zona horaria estimada
    language: String; // Idioma detectado en mensajes
  };
  referrer: {
    source: String; // Cómo llegó: 'search', 'tag', 'direct', 'referral'
    tag: String; // Tag específico por el que llegó
    campaign: String; // Si viene de una campaña específica
    medium: String; // 'organic', 'paid', 'social'
  };
  preferences: {
    favoriteShows: string[]; // Tipos de shows que más ve
    activeHours: number[]; // Horas en que más está activo
    spendingPattern: String; // 'impulsive', 'calculated', 'budget-conscious'
  };
  notes: String; // Notas personales de la modelo
  tags: string[]; // Etiquetas personalizadas
  createdAt: number; // Cuándo se creó el registro
  updatedAt: number; // Última actualización
  version: Number;
};
