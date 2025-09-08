export interface Order {
  id: string;
  user_id: number;
  order_number: string;
  shipping_address: string;
  recipient_phone: string;
  order_recipient_name: string;
  delivery_method: string;
  total_price: number;
  price_shipping: number;
  total_all: number;
  status: string;
  paid: number;
  paid_at?: string;
  notes?: string;
  order_items: {
    quantity: number;
    price: number;
    product: {
      id: number;
      name: string;
      image: {
        id: number;
        url: string;
      }[];
    };
  }[];
  created_at: string;
  updated_at: string;
}

interface ison {
  success: boolean;
  message: string;
  status?: number;
}

export interface OderCreateNew extends ison {
  order_id: number;
}

export interface OderDetailsByUser extends ison {
  data: Order;
}

export interface OderAllOderOfUser extends ison {
  data: Order[];
  total: number;
  limit: number;
  current_page: number;
  last_page: number;
}
