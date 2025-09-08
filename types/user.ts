export interface User {
  id: number;
  name: string;
  address: string;
  phone: string;
  role?: number;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserResponse {
  data: User[];
  total?: number;
  limit?: number;
  current_page?: number;
  last_page?: number;
  success?: boolean;
  message?: string;
  errors?: {
    email?: string[];
  };
}

export interface UserResponseOne {
  data: User | null;
  success?: boolean;
  message?: string;
  token: string;
}
