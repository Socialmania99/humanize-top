import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Humanize.top · Product & UI Blueprint",
  description: "141 tools, categorized menus and focused writing workspaces. Design reference; AI services are not connected.",
  other: {
    "codex-preview": "development",
  },
  robots: { index: false, follow: false },
  icons: {
    icon: `${process.env.SITE_BASE_PATH ?? ""}/favicon.svg`,
    shortcut: `${process.env.SITE_BASE_PATH ?? ""}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
