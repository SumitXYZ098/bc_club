import type { Metadata } from "next";
import "./globals.css";
import Head from "next/head";
import Header from "@/src/mainComponents/header/Header";
import Footer from "@/src/mainComponents/footer/Footer";
import { AuthProvider } from "@/src/mainComponents/auth/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import QueryProvider from "@/src/providers/QueryProvider";
import "swiper/css";
import "swiper/css/pagination";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

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
        <QueryProvider>
          <GoogleOAuthProvider clientId="265527084086-pd2igue5ksbto4srj2du15nj6b7re5ov.apps.googleusercontent.com">
            <AuthProvider>
              <Header />
              {children}
              <Footer />
              <ToastContainer />
            </AuthProvider>
          </GoogleOAuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
