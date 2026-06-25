export type LoginResponse = { ok: boolean };

export type SavedMessage = {
  id: string;
  message_id: string;
  sender: string;
  conversation_id: string;
  timestamp: string;
  created_at: string;
  is_relevant: boolean;
  skip_reason: string | null;
  processed_at: string;
  type: string;
  group_name: string | null;
  message_body: string | null;
  caption: string | null;
  image_url: string | null;
  ref_numbers: string[];
};

export type MessagesPage = {
  data: SavedMessage[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
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

export type DealIntent = "buy" | "sell" | "unknown";

export type Deal = {
  id: string;
  message_id: string;
  ref_number: string;
  intent: DealIntent;
  price_amount: number | null;
  price_currency: string | null;
  sender: string;
  conversation_id: string;
  group_name: string | null;
  message_timestamp: string;
  created_at: string;
  message_body: string;
  caption: string | null;
};

export type DealsPage = {
  data: Deal[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type DealMatch = {
  id: string;
  ref_number: string;
  buyer_deal_id: string;
  seller_deal_id: string;
  buyer_number: string;
  seller_number: string;
  buyer_price_amount: number | null;
  buyer_price_currency: string | null;
  seller_price_amount: number | null;
  seller_price_currency: string | null;
  created_at: string;
  buyer_group_name: string | null;
  buyer_message_body: string | null;
  buyer_caption: string | null;
  buyer_message_timestamp: string;
  seller_group_name: string | null;
  seller_message_body: string | null;
  seller_caption: string | null;
  seller_message_timestamp: string;
};

export type DealMatchesPage = {
  data: DealMatch[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
