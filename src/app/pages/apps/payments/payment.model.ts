import { Order } from '../orders/order.model';

export interface Payment {
  id?: string;
  order_id?: string;
  order?: Order;
  payment_method?: string;
  amount?: string;
  status?: string;
  notes?: string;
  paymob_order_id?: string;
  transaction_id?: string;
  created_at?: string;
}
