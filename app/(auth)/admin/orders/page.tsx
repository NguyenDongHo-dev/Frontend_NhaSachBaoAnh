"use client";

import { fetchAllOrderByAdmin } from "@/services/orderService";
import { OderAllOderOfUser } from "@/types/order";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import RenderDataOrders from "./renderDataOrders";
import Loading from "@/components/loading ";

export default function OrderAdminPage() {
  const searchParams = useSearchParams();
  const tokenStoge = localStorage.getItem("refresh_Token");
  const limit = 20;
  const [loading, setLoading] = useState(false);
  const page = Number(searchParams.get("page") || 1);

  const [allOder, setAllOder] = useState<OderAllOderOfUser>();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      if (tokenStoge) {
        const res = await fetchAllOrderByAdmin({
          token: tokenStoge,
          limit,
          page,
        });
        if (res.success) {
          setAllOder(res);
        }
      }
      setLoading(false);
    };
    fetchOrders();
  }, [page]);

  if (loading) {
    return <Loading />;
  }

  return <RenderDataOrders dataRer={allOder} />;
}
