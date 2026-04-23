import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

export const metadata = { title: "GiftVent", description: "Premium Gifting & Events — Dhaka" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0D0D0D] text-[#F5F5F5] min-h-screen">
        <AuthProvider>
          <Toaster position="top-center" toastOptions={{
            style: { background: "#1A1A1A", color: "#F5F5F5", border: "0.5px solid #C6A962" }
          }} />
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}