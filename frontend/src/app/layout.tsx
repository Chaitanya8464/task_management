import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "TaskFlow",
  description:
    "Task management workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}