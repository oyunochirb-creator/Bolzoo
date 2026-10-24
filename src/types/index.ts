export interface GradientTheme {
  id: string;
  name: string;
  description: string;
  gradientClass: string; // Tailwind class for linear top-to-bottom
  primaryColor: string; // Accent color hex or tailwind
  secondaryColor: string;
  cardBg: string;
  previewColors: [string, string, string];
}

export interface ActivityOption {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji
  category: 'romantic' | 'fun' | 'food' | 'chill' | 'creative';
  isCustom?: boolean;
}

export interface FoodOption {
  id: string;
  name: string;
  emoji: string;
  category: 'meal' | 'drink' | 'dessert';
}

export interface DateInvitation {
  id: string;
  senderName: string;
  receiverName: string;
  message: string;
  themeId: string;
  musicQuery: string; // Song name or YouTube URL/ID
  musicTitle?: string;
  suggestedActivities: string[]; // Activity IDs or custom strings
  suggestedFoods?: string[];
  createdAt: number;
}

export interface DateResponse {
  invitationId: string;
  receiverName: string;
  senderName: string;
  selectedDate: string; // YYYY-MM-DD
  selectedTime: string; // HH:MM
  timeOfDay: 'morning' | 'afternoon' | 'sunset' | 'night';
  selectedActivities: string[];
  customActivities: string[];
  selectedFoods: string[];
  receiverNote: string;
  confirmedAt: number;
}
