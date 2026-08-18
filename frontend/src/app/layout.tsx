import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/providers/ThemeProvider";
import GoogleProvider from "./GoogleProvider";

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
  <GoogleProvider>
    {children}
  </GoogleProvider>
</ThemeProvider>
      </body>
    </html>
  );
}