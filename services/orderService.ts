import {
  ison,
  OderAllOderOfUser,
  OderCreateNew,
  OderDetailsByUser,
} from "@/types/order";

interface playLoatNew {
  token: string;
  formOder: any;
  id?: number;
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
  search,
  typeSearch,
  status,
}: {
  token: string;
  page: number;
  limit: number;
  search?: string;
  typeSearch?: string;
  status?: string;
}): Promise<OderAllOderOfUser> => {
  const params: Record<string, string> = {
    limit: limit.toString(),
    page: page.toString(),
  };

  if (search) {
    params.search = search;
  }
  if (status) {
    params.status = status;
  }

  if (typeSearch) {
    params.typeSearch = typeSearch;
  }
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

export const fetchDetailByAdminOrder = async ({
  token,
  idOrder,
}: {
  token: string;
  idOrder: number;
}): Promise<OderDetailsByUser> => {
  const res = await fetch(
    `${process.env.API_SERVER}/api/order/details/${idOrder}`,
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

export const fetchUpdateOrderByAdmin = async ({
  formOder,
  token,
  id,
}: playLoatNew): Promise<OderDetailsByUser> => {
  const res = await fetch(`${process.env.API_SERVER}/api/order/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formOder),
  });
  return res.json();
};

export const fetchCancelledByAdmin = async ({
  token,
  id,
}: {
  token: string;
  id: number;
}): Promise<OderDetailsByUser> => {
  const res = await fetch(
    `${process.env.API_SERVER}/api/order/cancelled/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.json();
};
