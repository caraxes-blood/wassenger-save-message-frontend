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

export type FailedMessage = {
  jobId: string;
  messageId: string;
  from: string;
  body: string;
  type: string;
  failedAt: string;
  createdAt: string;
  error: string;
};

export type FailedMessagesPage = {
  data: FailedMessage[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
