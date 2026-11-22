import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Humanize.top · Writing tools",
  description: "Rewrite, edit, translate and generate text with Humanize.top.",
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
