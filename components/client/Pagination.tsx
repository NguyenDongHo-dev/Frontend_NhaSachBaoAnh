"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface Props {
  currentPage: number;
  lastPage: number;
}

export default function Pagination({ currentPage, lastPage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
        className="px-[7px]  rounded-full cursor-pointer w-[33.66px] h-[33.66px] text-black flex items-center justify-center border-2 border-black  hover:bg-primary hover:text-white disabled:hidden"
      >
        <ChevronLeft />
      </button>

      {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => changePage(page)}
          className={`px-[7px]  rounded-full cursor-pointer w-[33.66px] h-[33.66px] text-black flex items-center justify-center border-2 border-black  ${
            currentPage === page
              ? "bg-primary text-white border-2 border-black-primary"
              : "hover:bg-primary hover:text-white"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === lastPage}
        onClick={() => changePage(currentPage + 1)}
        className="px-[7px]  rounded-full cursor-pointer w-[33.66px] h-[33.66px] text-black flex items-center justify-center border-2 border-black  hover:bg-primary hover:text-white disabled:hidden"
      >
        <ChevronRight />
      </button>
    </div>
  );
}
