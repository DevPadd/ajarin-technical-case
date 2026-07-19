import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/Sidebar";
import DevFab from "@/components/dev-fab";
import { GamificationProvider } from "@/components/streak-provider";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <GamificationProvider>
      <div className="flex flex-col md:flex-row h-screen w-full">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              borderRadius: "9999px",
              padding: "10px 20px",
              fontSize: "13px",
              fontWeight: 500,
            },
            success: {
              iconTheme: { primary: "#fb923c", secondary: "#fff" },
              style: { background: "#fb923c", color: "#fff" },
            },
          }}
        />
        <DevFab />
      </div>
    </GamificationProvider>
  );
}
