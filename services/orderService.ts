import {
  ison,
  OderAllOderOfUser,
  OderCreateNew,
  OderDetailsByUser,
} from "@/types/order";

interface playLoatNew {
  token: string;
  formOder: any;
}

export const fetchCreateOrder = async ({
  formOder,
  token,
}: playLoatNew): Promise<OderCreateNew | null> => {
  const res = await fetch(`${process.env.API_SERVER}/api/order`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formOder,
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};

export const fetchDetailOrder = async ({
  token,
  idOrder,
}: {
  token: string;
  idOrder: number;
}): Promise<OderDetailsByUser> => {
  const res = await fetch(`${process.env.API_SERVER}/api/order/${idOrder}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return { ...data, status: res.status };
  }

  return data;
};

export const fetchAllOrderOflUser = async ({
  token,
  page = 1,
  limit,
}: {
  token: string;
  page: number;
  limit: number;
}): Promise<OderAllOderOfUser> => {
  const params: Record<string, string> = {
    limit: limit.toString(),
    page: page.toString(),
  };
  const queryParams = new URLSearchParams(params);

  const res = await fetch(
    `${process.env.API_SERVER}/api/order?${queryParams}`,
    {
      method: "GET",
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

export const fetchDeleteOderOfUser = async ({
  id,
  token,
}: {
  id: number;
  token: string;
}): Promise<ison> => {
  const res = await fetch(`${process.env.API_SERVER}/api/order/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return { ...data, status: res.status };
  }

  return data;
};

export const fetchAllOrderByAdmin = async ({
  token,
  page = 1,
  limit,
}: {
  token: string;
  page: number;
  limit: number;
}): Promise<OderAllOderOfUser> => {
  const params: Record<string, string> = {
    limit: limit.toString(),
    page: page.toString(),
  };
  const queryParams = new URLSearchParams(params);

  const res = await fetch(
    `${process.env.API_SERVER}/api/order/allOrder?${queryParams}`,
    {
      method: "GET",
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
