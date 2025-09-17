"use client";

import Loading from "@/components/loading ";
import { useAppSelector } from "@/hooks/redux";
import { Dashboard, fetchDashboard } from "@/services/dashboardService";
import { formatPrice, isStates, statusColors } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAppSelector((state) => state.user);
  const [tap, setTap] = useState("day");
  const [loading, setLoading] = useState(false);

  const status = searchParams.get("status") || "all";

  const [data, setData] = useState<Dashboard>();
  const COLORS = ["#FFBB28", "#00C49F", "#FF8042", "#0088FE"];
  useEffect(() => {
    const fetchDashboardInPage = async () => {
      setLoading(true);
      if (user.token) {
        const res = await fetchDashboard({ token: user.token, status });
        setLoading(false);
        if (res.success) {
          setData((prev) => {
            if (!prev) return res;
            return {
              ...prev,
              data: {
                ...prev.data,
                totalOrders: res.data.totalOrders,
                totalPrice: res.data.totalPrice,
                ordersPerMonth: res.data.ordersPerMonth,
                ordersPerDay: res.data.ordersPerDay,
              },
            };
          });
        }
      }
    };
    fetchDashboardInPage();
  }, [status]);

  const changePage = (str: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", str);
    router.push(`?${params.toString()}`);
  };

  const pieData = data?.data.statusCounts?.map((item) => ({
    ...item,
    status: isStates(item.status),
  }));

  return (
    <div>
      {loading && <Loading />}
      <h1 className="font-bold text-primary text-[20px]">Dashboard</h1>
      <div className="mt-4 inline-flex rounded-lg border shadow overflow-hidden">
        <button
          onClick={() => changePage("all")}
          className={`px-4 py-2 text-sm font-medium ${
            status === "all"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-white text-gray-700 hover:bg-gray-100"
          } cursor-pointer`}
        >
          Tất cả
        </button>
        <button
          onClick={() => changePage("padding")}
          className={`px-4 py-2 text-sm font-medium ${
            status === "padding"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-white text-gray-700 hover:bg-gray-100"
          } cursor-pointer`}
        >
          Đơn hàng đang xử lý
        </button>
        <button
          onClick={() => changePage("shipping")}
          className={`px-4 py-2 text-sm font-medium ${
            status === "shipping"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-white text-gray-700 hover:bg-gray-100"
          } cursor-pointer`}
        >
          Đơn hàng đang giao
        </button>
        <button
          onClick={() => changePage("success")}
          className={`px-4 py-2 text-sm font-medium ${
            status === "success"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-white text-gray-700 hover:bg-gray-100"
          } cursor-pointer`}
        >
          Đơn hàng thành công
        </button>
        <button
          onClick={() => changePage("cancel")}
          className={`px-4 py-2 text-sm font-medium ${
            status === "cancel"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-white text-gray-700 hover:bg-gray-100"
          } cursor-pointer`}
        >
          Đơn hàng đã hủy
        </button>
      </div>
      <div className="grid grid-cols-3 gap-5 mt-4 ">
        <div className="bg-blue-500 text-white p-4 rounded-xl shadow-lg flex flex-col items-center">
          <div className="text-lg font-semibold">👤 Tổng người dùng</div>
          <div className="text-2xl font-bold mt-2">
            {data?.data.totalUser || 0}
          </div>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-xl shadow-lg flex flex-col items-center">
          <div className="text-lg font-semibold">📦 Tổng đơn hàng</div>
          <div className="text-2xl font-bold mt-2">
            {data?.data.totalOrders || 0}
          </div>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded-xl shadow-lg flex flex-col items-center">
          <div className="text-lg font-semibold">💰 Doanh thu</div>
          <div className="text-2xl font-bold mt-2">
            {formatPrice(data?.data.totalPrice || 0)} đ
          </div>
        </div>
      </div>
      <div className=" min-h-[500px] bg-gray-100 rounded-xl shadow-inner p-4 mt-4">
        <div className="flex flex-col  justify-between h-full">
          <div className="flex">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={
                    tap === "day"
                      ? data?.data.ordersPerDay?.map((item) => {
                          const d = new Date(item.day);
                          return {
                            ...item,
                            day: `${d.getDate()}/${d.getMonth() + 1}`,
                          };
                        })
                      : data?.data.ordersPerMonth?.map((item) => ({
                          ...item,
                          month: `Tháng ${item.month}`,
                        }))
                  }
                  barGap={1}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={tap} />
                  <YAxis />
                  <Tooltip
                    formatter={(value: any, name: string) => {
                      if (name === "Doanh thu") {
                        return [`${formatPrice(value)}₫`, name];
                      }
                      return [value, name];
                    }}
                  />

                  <Bar dataKey="total_revenue" fill="#82ca9d" name="Doanh thu">
                    <LabelList
                      dataKey="total_revenue"
                      position="top"
                      formatter={(val: any) => `${formatPrice(val)}₫`}
                    />
                  </Bar>
                  <Bar dataKey="total_orders" fill="#8884d8" name="Đơn hàng">
                    <LabelList dataKey="total_orders" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="total"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    label={({ name, percent }: any) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {data?.data.statusCounts.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="inline-flex rounded-lg shadow overflow-hidden border">
              <button
                onClick={() => setTap("day")}
                className={`px-4 py-2 ${
                  tap === "day"
                    ? " hover:bg-blue-600 bg-blue-500"
                    : " hover:bg-gray-100"
                }  font-medium  transition cursor-pointer`}
              >
                Theo ngày
              </button>
              <button
                onClick={() => setTap("month")}
                className={`px-4 py-2 ${
                  tap === "month"
                    ? " hover:bg-blue-600 bg-blue-500"
                    : " hover:bg-gray-100"
                }  font-medium  transition cursor-pointer`}
              >
                Theo tháng
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mt-4 ">
        <div className="bg-white p-5 rounded-xl shadow-md border">
          <h1 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
            🛍️ Đơn hàng mới nhất
          </h1>
          <ul className="space-y-2 text-sm text-gray-600">
            {data?.data.orderNew.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>Order #{item.order_number}</span>
                <span className={`font-medium ${statusColors[item?.status!]}`}>
                  {isStates(item.status)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border">
          <h1 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
            ⚠️ Sản phẩm sắp hết
          </h1>
          <ul className="space-y-2 text-sm text-gray-600">
            {data?.data.productLowStock.map((product) => (
              <li key={product.id} className="flex justify-between">
                <span className="line-clamp-1">{product.name}</span>
                <span className="font-medium text-red-500">
                  Còn {product.stock}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
