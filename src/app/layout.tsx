import type { Metadata, Viewport } from "next";
import { Poppins, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/Providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"], variable: "--font-poppins" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "RoboEdu QC Hub",
  description: "Portal Manajemen Kualitas & Alur Kerja Terpadu",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "RoboEdu QC Hub",
    description: "Portal Manajemen Kualitas & Alur Kerja Terpadu",
    url: "https://roboedu-studio.vercel.app",
    siteName: "RoboEdu",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RoboEdu QC Hub Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script src="https://js.puter.com/v2/"></script>
      </head>
      <body className={`${poppins.variable} ${jakarta.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers attribute="data-theme" defaultTheme="light" enableSystem>
          {children}

          <ToastContainer position="top-right" theme="colored" autoClose={3000} />
        </Providers>
      </body>
    </html>
  );
}
