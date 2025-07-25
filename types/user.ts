export interface User {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  reated_at: string;
  updated_at: string;
}

export interface UserResponse {
  data: User[];
  token: string;
  success: boolean;
  message: string;
}
