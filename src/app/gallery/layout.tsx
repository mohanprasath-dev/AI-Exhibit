import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore AI-generated creations from our talented community. Browse stunning artwork, music, videos, and more.",
};

function GalleryLoading() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-8">
          <div className="text-center">
            <div className="h-12 w-48 bg-white/10 rounded-xl mx-auto mb-4" />
            <div className="h-6 w-96 bg-white/10 rounded-lg mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/5 overflow-hidden">
                <div className="aspect-[4/3] bg-white/10" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-white/10 rounded w-3/4" />
                  <div className="h-4 bg-white/10 rounded" />
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<GalleryLoading />}>{children}</Suspense>;
}
