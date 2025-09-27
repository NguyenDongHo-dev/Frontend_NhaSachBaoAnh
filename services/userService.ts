import { UserResponse, UserResponseOne } from "@/types/user";

interface LoginPayload {
  email: string;
  password: string;
}

interface PayloatCreateUser {
  token: string;
  form: any;
}

export interface APIResponse extends UserResponseOne {
  status?: number;
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
  refresh_Token?: string;
}

export const fetchLogin = async (
  payload: LoginPayload
): Promise<APIResponse> => {
  const res = await fetch(`${process.env.API_SERVER}/api/user/login`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
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
  const res = await fetch(`${process.env.API_SERVER}/api/user/register`, {
    method: "POST",
    cache: "no-store",
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

export const fetchCreateUser = async ({
  token,
  form,
}: PayloatCreateUser): Promise<APIResponse> => {
  const res = await fetch(`${process.env.API_SERVER}/api/user/createUser`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  if (!res.ok) {
    return { ...data, status: res.status };
  }

  return data;
};

export const fetchUpdateUserByAdmin = async ({
  token,
  form,
}: PayloatCreateUser): Promise<APIResponse> => {
  const res = await fetch(
    `${process.env.API_SERVER}/api/user/updateByAdmin/${form.id}`,
    {
      method: "PUT",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(form),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return { ...data, status: res.status };
  }

  return data;
};

export const fetchDetailUser = async ({
  token,
}: {
  token: string;
}): Promise<APIResponse> => {
  const res = await fetch(`${process.env.API_SERVER}/api/user/details`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return { ...data, status: res.status };
  }

  return data;
};

export const fetchDetailUserByAdmin = async ({
  token,
  id,
}: {
  token: string;
  id: number;
}): Promise<UserResponseOne> => {
  const res = await fetch(
    `${process.env.API_SERVER}/api/user/detailsByAdmin/${id}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return { ...data, status: res.status };
  }

  return data;
};

export const fetchAllUser = async ({
  token,
  page = 1,
  limit,
  sort,
  searchEmail,
}: {
  token: string;
  page: number;
  limit: number;
  sort: string;
  searchEmail?: string;
}): Promise<UserResponse> => {
  const params: Record<string, string> = {
    limit: limit.toString(),
    page: page.toString(),
    sort: sort,
  };
  if (searchEmail) {
    params.email = searchEmail;
  }
  const queryParams = new URLSearchParams(params);
  const res = await fetch(
    `${process.env.API_SERVER}/api/user/allUser?${queryParams}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  const data = await res.json();

  if (!res.ok) {
    return { ...data, status: res.status };
  }

  return data;
};

export const fetchDeleteUser = async ({
  id,
  token,
}: {
  id: number;
  token: string;
}): Promise<UserResponseOne | null> => {
  const res = await fetch(`${process.env.API_SERVER}/api/user/delete/${id}`, {
    method: "DELETE",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};

export const fetchUpdateUser = async ({
  token,
  form,
}: PayloatCreateUser): Promise<APIResponse> => {
  const res = await fetch(
    `${process.env.API_SERVER}/api/user/update/${form.id}`,
    {
      method: "PUT",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(form),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return { ...data, status: res.status };
  }

  return data;
};

export const fetchLogoutUser = async () => {
  const res = await fetch(`${process.env.API_SERVER}/api/user/logout`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return { ...data, status: res.status };
  }

  return data;
};
