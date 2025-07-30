import { UserResponse } from "@/types/user";

interface LoginPayload {
  email: string;
  password: string;
}

export interface APIResponse extends UserResponse {
  status?: number;
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
}

export const fetchLogin = async (
  payload: LoginPayload
): Promise<APIResponse> => {
  const res = await fetch(`${process.env.API_SERVER}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    return { ...data, status: res.status };
  }

  return data;
};

export const fetchRegister = async (
  payload: LoginPayload
): Promise<APIResponse> => {
  const res = await fetch(`${process.env.API_SERVER}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    return { ...data, status: res.status };
  }

  return data;
};
