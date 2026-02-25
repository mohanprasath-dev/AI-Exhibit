import type { Metadata } from "next";
import SubmitPageClient from "./SubmitPageClient";

export const metadata: Metadata = {
  title: "Submit Entry",
  description:
    "Submit your AI-generated creation to AI Exhibit. Share your artwork, music, videos, and more with our community.",
};

export default function SubmitPage() {
  return <SubmitPageClient />;
}
