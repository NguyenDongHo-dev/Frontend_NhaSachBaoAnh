import { UserResponse } from "@/types/user";

interface LoginPayload {
  email: string;
  password: string;
}

export const fetchLogin = async (
  payload: LoginPayload
): Promise<UserResponse> => {
  const res = await fetch(`${process.env.API_SERVER}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to fetch");

  return res.json();
};
