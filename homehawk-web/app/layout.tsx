import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HomeHawk",
  description: "We Keep Watch, You Keep Living.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-[var(--brand-text)]">
        <header className="w-full border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="font-bold text-xl" style={{ color: "var(--brand-primary)" }}>
              HomeHawk
            </div>
            <div className="text-sm" style={{ color: "var(--brand-primary)" }}>
              We Keep Watch, You Keep Living.
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
