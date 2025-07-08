export interface Message {
  role?: "user" | "system" | "assistant";
  createdAt?: Date;
  content?: string;
  id?: string;
  timestamp?: string;
}

export interface ChatHistoryItem {
  id: string;
  urlId?: string;
  description?: string;
  messages: Message[];
  timestamp: string;
}
