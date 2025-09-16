"use client";

import { fetchAllOrderByAdmin } from "@/services/orderService";
import { OderAllOderOfUser } from "@/types/order";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import RenderDataOrders from "./renderDataOrders";
import Loading from "@/components/loading ";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppSelector } from "@/hooks/redux";

export default function OrderAdminPage() {
  const user = useAppSelector((state) => state.user);
  const searchParams = useSearchParams();
  const limit = 20;
  const [loading, setLoading] = useState(false);
  const page = Number(searchParams.get("page") || 1);

  const searchType = searchParams.get("typeSearch") || "all";
  const status = searchParams.get("status") || "all";
  const search = searchParams.get("search") || "";
  const debounce = useDebounce(search);

  const [allOder, setAllOder] = useState<OderAllOderOfUser>();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      if (user.token && user.isLoggedIn) {
        const res = await fetchAllOrderByAdmin({
          token: user.token,
          limit,
          page,
          search: debounce,
          typeSearch: searchType,
          status,
        });

        if (res.success) {
          setAllOder(res);
          setLoading(false);
        }
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, debounce, status]);

  return <RenderDataOrders dataRer={allOder} loading={loading} />;
}
