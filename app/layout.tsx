import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import type React from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} h-full`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
