export type LoginResponse = { ok: boolean };

export type SavedMessage = {
  id: string;
  message_id: string;
  sender: string;
  conversation_id: string;
  timestamp: string;
  payload: unknown;
  created_at: string;
};

export type MessagesPage = {
  data: SavedMessage[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
