export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  icon: string;
  color: string;
  data: {
    balance: number;
    reason: string;
    formatted_balance: string;
  };
  read: boolean;
  read_at: string;
  action_url: string;
  created_at: string;
  updated_at: string;
}
