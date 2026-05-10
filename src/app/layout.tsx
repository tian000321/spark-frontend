import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "星火算力 - AI 智能体平台",
  description: "全球首个内建全合规链路的异构算力调度与多智能体协作操作系统",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          .desktop-nav { display: flex; }
          .hamburger-btn { display: none; }
          .mobile-menu { display: block; }
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
            .hamburger-btn { display: flex !important; }
            .mobile-menu { display: block; }
          }
        `}</style>
      </head>
      <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: 'var(--bg-secondary)', color: 'var(--text-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '60px' }}>
        <Header />
        <main style={{ flex: 1, width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
          {children}
        </main>
        <footer className="text-center text-xs text-gray-500 py-4 border-t mt-8">
          <p>星火科技 Spark Tech</p>
          <p className="mt-1">星是规则，火是相信 · 配优质的资源，解客户的安心</p>
          <p className="mt-2">© 2026 星火算力 · 隐私政策 · 服务条款</p>
        </footer>
      </body>
    </html>
  );
}