import type { Metadata } from "next";
import FavouritePage from "./favourite";

export const metadata: Metadata = {
  title: "Sở thích – Nhà sách Bảo Anh",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Favourite() {
  return <FavouritePage />;
}
