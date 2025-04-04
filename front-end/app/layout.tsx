// app/layout.tsx (Root Server Layout)
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import './styles/globals.css';
import { Providers } from '../providers/provider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JayLoy",
  description: "Spend wisely, waste less, save more",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
    shortcut: "/icon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}