// app/layout.js
import "../styles/global.css";
import React from "react";

export const metadata = {
  title: "Docufam",
  description: "your trusted document manager tool",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
