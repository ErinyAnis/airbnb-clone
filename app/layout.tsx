import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import ClientOnly from "./components/ClientOnly";
import RegisterModal from "./components/modals/RegisterModal";
import ToasterProvider from "./providers/ToasterProvider";
import LoginModal from "./components/modals/LoginModal";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "./components/modals/RentModal";
import SearchModal from "./components/modals/SearchModal";
import Providers from "./components/Providers";

// Load the font
const font = Nunito({
  subsets: ["latin"],
});

// Metadata with favicon
export const metadata: Metadata = {
  title: "Airbnb",
  description: "Airbnb clone",
  icons: {
    icon: "/images/favicon.webp",
  },
};

// RootLayout component
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <ClientOnly>
          <ToasterProvider />
          <RentModal />
          <SearchModal />
          <RegisterModal />
          <LoginModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>

        <div className="pb-20 pt-28">
          <Providers>{children} </Providers>
        </div>
      </body>
    </html>
  );
}
