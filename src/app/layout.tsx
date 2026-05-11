import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import OrcaFloating from "@/components/OrcaFloating";
import "./globals.css";

export const metadata: Metadata = {
  title: "星火科技 Spark Tech",
  description: "星是规则，火是相信",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, background: '#0A0A0F', color: '#F5F5F7', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ display: 'flex', height: '100vh' }}>
          <Sidebar />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <TopBar />
            <main style={{ flex: 1, overflow: 'auto', padding: '32px', background: 'radial-gradient(circle at 50% 0%, #1A1A2E 0%, #0A0A0F 100%)' }}>
              {children}
            </main>
          </div>
        </div>
        <OrcaFloating />
      </body>
    </html>
  );
}