import Navbar from "./Navbar";
import Footer from "./Footer";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* pt-[70px] compensates for the fixed header height */}
      <main className="flex-1 pt-[70px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
