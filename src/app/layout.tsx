import type { Metadata } from "next";
import "./globals.css";
import Head from "next/head";
import Header from "@/src/mainComponents/header/Header";
import Footer from "@/src/mainComponents/footer/Footer";
import { AuthProvider } from "@/src/mainComponents/auth/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "swiper/css";
import "swiper/css/pagination";

export const metadata: Metadata = {
  title: "BC Club",
  description: "British Columbia Club",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@xz/fonts@1/serve/plus-jakarta-display.min.css"
        />
      </Head>
      <body className={`plusJakartaDisplay antialiased bg-background`}>
        <GoogleOAuthProvider clientId="1027810983202-so3tffohuoqsk6k96dmn9t2n7rihjklb.apps.googleusercontent.com">
          <AuthProvider>
            <Header />
            {children}
            <Footer />
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
