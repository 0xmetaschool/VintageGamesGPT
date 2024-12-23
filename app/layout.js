import { Inter } from "next/font/google";
import { Press_Start_2P } from 'next/font/google';
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/ui/Footer";

const inter = Inter({ subsets: ["latin"] });
const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: "VintageGamesGPT",
  description: "Generate or edit vintage games using AI",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en" className={pressStart2P.className}>
      <body className={inter.className}>
        {children}
        <Footer/> 
         
      </body>
    </html>
    </ClerkProvider>
  );
}
