import React from "react";
import "./globals.css";

export const metadata = {
  title: "ClosetClear",
  description: "Premium smart wardrobe" 
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
