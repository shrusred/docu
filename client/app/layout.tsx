// client/app/layout.tsx
import "../styles/global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-red-500">{children}</body>
    </html>
  );
}
