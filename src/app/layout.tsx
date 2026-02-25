import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar, Footer } from "@/components/layout";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/Toast";
import { BackToTop } from "@/components/BackToTop";
import { LiveBackground } from "@/components/LiveBackground";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "AI Exhibit - A Digital Showcase of AI-Powered Creativity",
    template: "%s | AI Exhibit",
  },
  description:
    "Submit your AI-generated creations and compete for votes. Explore stunning AI art, music, videos, and more in our digital gallery.",
  keywords: [
    "AI art",
    "AI generated",
    "artificial intelligence",
    "digital art",
    "AI music",
    "AI video",
    "creative AI",
    "gallery",
    "competition",
  ],
  authors: [{ name: "AI Exhibit Team" }],
  creator: "AI Exhibit",
  publisher: "AI Exhibit",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aiexhibit.com",
    siteName: "AI Exhibit",
    title: "AI Exhibit - A Digital Showcase of AI-Powered Creativity",
    description:
      "Submit your AI-generated creations and compete for votes. Explore stunning AI art, music, videos, and more.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "AI Exhibit - A Digital Showcase of AI-Powered Creativity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Exhibit - A Digital Showcase of AI-Powered Creativity",
    description:
      "Submit your AI-generated creations and compete for votes.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col`}>
        <AuthProvider>
          <ToastProvider position="bottom-right">
            <LiveBackground />
            <Navbar />
            <main className="flex-1 pt-16 lg:pt-20">{children}</main>
            <Footer />
            <BackToTop />
            <Toaster />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
