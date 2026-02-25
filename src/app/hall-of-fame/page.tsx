import type { Metadata } from "next";
import HallOfFameClient from "./HallOfFameClient";

export const metadata: Metadata = {
  title: "Hall of Fame",
  description:
    "Celebrating the best AI creations across all categories. Meet the Category Heads and their winning masterpieces.",
};

export default function HallOfFamePage() {
  return <HallOfFameClient />;
}
