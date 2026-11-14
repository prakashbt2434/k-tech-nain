import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ConfigError from "../components/ConfigError";
import { LanguageProvider } from "../lib/LanguageContext";
import { isFirebaseConfigured, missingFirebaseEnv } from "../lib/firebase";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Farm To Table",
  description: "Buy directly from farmers. No middlemen.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {isFirebaseConfigured ? (
          <LanguageProvider>
            <Navigation />
            {children}
            <Footer />
          </LanguageProvider>
        ) : (
          <ConfigError missing={missingFirebaseEnv} />
        )}
      </body>
    </html>
  );
}
