import ThemeRegistry from "@/context/ThemeRegistry";
import "./globals.css";
import "animate.css";
import "../style/bs-grid.css";
import "../node_modules/swiper/swiper-bundle.min.css";
import type { Metadata } from "next";
import { Box } from "@mui/material";
import { roboto } from "@/fonts/fonts";
import Navbar from "@/components/Navbar";
import FloatingFilterButton from "@/components/utils/FloatingFilterButton";
import MyDataQueryProvider from "@/context/MyDataQueryProvider";
import SnackbarProviderClient from "@/context/SnackbarProviderClient";
import Footer from "@/components/Footer";
<<<<<<< HEAD
import NextAuthProvider from "@/components/NextAuthProvider";
=======
>>>>>>> 041d2222496ac2662c55bddf225898e821df62a7

export const metadata: Metadata = {
  title: {
    default: "MovieDB Search",
    template: "%s | MovieDB Search",
  },
  description:
    "Explore the Cinematic Universe. Discover a World of Movies and TV Shows at Your Fingertips",
  keywords: [
    "search movie",
    "popular movie",
    "trending movies",
    "trending tv shows",
    "movie database search",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <MyDataQueryProvider>
          <ThemeRegistry options={{ key: "mui", prepend: false }}>
            <NextAuthProvider>
              <Box minHeight="100vh" display="flex" flexDirection="column">
                <SnackbarProviderClient>
                  <Navbar />
                  {children}
                  <FloatingFilterButton />
                </SnackbarProviderClient>
                <Footer />
              </Box>
            </NextAuthProvider>
          </ThemeRegistry>
        </MyDataQueryProvider>
      </body>
    </html>
  );
}
