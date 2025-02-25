// app/layout.tsx

import "./globals.css";
import Navbar from "@/components/navbar/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="flex h-screen w-screen flex-col sm:flex-row">
        <div className="flex justify-between items-center px-3 bg-gray-900 w-full h-16 sm:h-screen sm:w-1/4 sm:max-w-64 sm:min-w-fit sm:flex-col sm:justify-start sm:px-0 sm:items-stretch">
          <div className="text-white text-xl p-4 font-bold text-center">
            My Finannce
          </div>
          <Navbar />
        </div>
        <div className="flex-1 flex flex-wrap p-4 overflow-auto h-[calc(100vh-4rem)] sm:h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}