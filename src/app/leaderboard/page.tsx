import type { Metadata } from "next";
import LeaderboardClient from "./LeaderboardClient";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "See the top-voted AI creations on AI Exhibit. Discover the most popular artwork, music, and videos.",
};

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
