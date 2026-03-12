import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Latimore Hub OS",
  description: "CRM operating system for Latimore Life & Legacy",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
