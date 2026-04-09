import AppClientShell from "@/components/shared/AppClientShell";
import Footer from "@/components/shared/Footer";
import NavbarClientShell from "@/components/shared/NavbarClientShell";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const THEME_BOOTSTRAP_SCRIPT = `(() => {
  try {
    const key = "theme";
    const root = document.documentElement;
    const saved = localStorage.getItem(key);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = saved === "light" || saved === "dark" ? saved : (prefersDark ? "dark" : "light");

    root.classList.toggle("dark", resolved === "dark");
    root.setAttribute("data-theme", resolved);
  } catch {
    // Ignore localStorage/matchMedia failures during early boot.
  }
})();`;

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgroLink — কৃষক থেকে ক্রেতা",
  description:
    "AgroLink connects Bangladeshi farmers directly to buyers — eliminating middlemen and ensuring fair pricing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className={geist.className}>
        <NavbarClientShell />
        {children}
        <Footer />
        <AppClientShell />
      </body>
    </html>
  );
}

