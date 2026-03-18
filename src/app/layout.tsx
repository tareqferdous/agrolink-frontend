import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

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
    <html lang='en'>
      <body className={geist.className}>
        {children}
        <Toaster position='top-right' richColors />
      </body>
    </html>
  );
}
