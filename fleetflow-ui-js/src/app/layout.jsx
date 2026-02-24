

import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display"
});

export const metadata = {
  title: "FleetIQ | Professional Fleet Management",
  description: "Advanced logistics operating system for modern fleets."
};

export default function RootLayout({
  children


}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} ${inter.className}`}>
        
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>);

}