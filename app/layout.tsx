import ThemeRegistry from "@/context/ThemeRegistry";
import "./globals.css";
import "animate.css";
import "../node_modules/swiper/swiper-bundle.min.css";
import type { Metadata } from "next";
import { roboto } from "@/fonts/fonts";
import Navbar from "@/components/Navbar";
import FloatingFilterButton from "@/components/utils/FloatingFilterButton";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeRegistry options={{ key: "mui", prepend: false }}>
          <Navbar />
          {children}
          <FloatingFilterButton />
        </ThemeRegistry>
      </body>
    </html>
  );
}
