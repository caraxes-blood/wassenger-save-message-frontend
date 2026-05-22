export type LoginResponse = { ok: boolean };

export type SavedMessage = {
  id: string;
  message_id: string;
  sender: string;
  conversation_id: string;
  timestamp: string;
  payload: unknown;
  created_at: string;
  /** When omitted (older payloads), UI treats as unknown. */
  is_relevant?: boolean;
  skip_reason?: string | null;
  sender_name?: string | null;
  chat_name?: string | null;
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

export type CleanedMessage = {
  id: string;
  message_id: string;
  sender: string;
  conversation_id: string;
  timestamp: string;
  clean_body: string;
  intent: string;
  confidence: number;
  intent_signal: string;
  price_usd: number | null;
  watch_ref: string | null;
  condition: string | null;
  language: string;
  is_system: boolean;
  processed_at: string;
};

export type User = {
  phone: string;
  name: string | null;
  wid: string | null;
  created_at: string;
  updated_at: string;
};

export type UsersPage = {
  data: User[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type Group = {
  wid: string;
  name: string | null;
  device_id: string | null;
  active: boolean;
  total_participants: number | null;
  is_archive: boolean;
  created_at: string | null;
  last_message_at: string | null;
  last_synced_at: string | null;
};

export type GroupsResponse = {
  data: Group[];
};

export type GroupsPage = {
  data: Group[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type CleanedMessagesPage = {
  data: CleanedMessage[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
