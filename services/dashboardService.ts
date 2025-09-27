export interface Dashboard {
  data: {
    totalUser: number;
    statusCounts: {
      status: string;
      total: number;
    }[];
    totalOrders: number;
    orderNew: {
      id: number;
      order_number: string;
      status: string;
      created_at: string;
    }[];

    productLowStock: {
      id: number;
      name: string;
      stock: string;
    }[];
    totalPrice: number;

    ordersPerMonth: {
      month: number;
      total_orders: number;
      total_revenue: number;
    }[];
    ordersPerDay: {
      day: number;
      total_orders: number;
      total_revenue: number;
    }[];
  };
  success: boolean;
  message: string;
}

export const fetchDashboard = async ({
  token,
  status,
}: {
  token: string;
  status: string;
}): Promise<Dashboard> => {
  const queryParams = new URLSearchParams({ status });
  const res = await fetch(
    `${process.env.API_SERVER}/api/dashboard?${queryParams}`,
    {
      cache: "no-store",
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
