// app/layout.tsx

import "./globals.css";
import Navbar from "@/UI/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="flex h-screen flex-col sm:flex-row">
        <div className="w-full flex-none sm:w-64">
          <Navbar />
        </div>
        <div className="flex-grow p-6 sm:p-12">
          {children}
        </div>
      </body>
    </html>
  );
}
