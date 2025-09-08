import React from "react";
import SearchHeader from "./SearchHeader";

export default function NotFondComponent() {
  return (
    <div className="md:mt-0 mt-[30px] pt-10  max-w-laptop mx-auto md:max-w-laptop md:mx-auto w-full px-[15px]">
      <div className="flex gap-25 items-center">
        <div className="text-[6em] font-bold text-[#b2b2b2] ">404</div>
        <div className="flex-1">
          <p className="text-primary font-bold text-[27px]">
            Oops! That page can’t be found.
          </p>
          <p className="mt-[14px] mb-[20px]">
            It looks like nothing was found at this location. Maybe try one of
            the links below or a search?
          </p>
          <SearchHeader />
        </div>
      </div>
    </div>
  );
}
