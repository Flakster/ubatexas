import { Inter, Playfair_Display } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from '@/context/AuthContext';
import { Suspense } from 'react';
import AuthRecoveryDetector from '@/components/auth/AuthRecoveryDetector';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

export const metadata = {
  metadataBase: new URL('https://ubatexas.com'),
  title: {
    default: 'Ubatexas | El Escenario de la Provincia de Ubaté',
    template: '%s | Ubatexas'
  },
  description: 'Explora lo mejor de Ubaté: servicios, comercio, eventos, gente, cultura y noticias. La guía definitiva de la Capital Lechera de Colombia.',
  alternates: {
    canonical: 'https://ubatexas.com',
  },
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Ubatexas | El Escenario de la Provincia',
    description: 'Digital Media & Lifestyle en la Provincia de Ubaté.',
    url: 'https://ubatexas.com',
    siteName: 'Ubatexas',
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ubatexas',
    description: 'Digital Media & Lifestyle en la Provincia de Ubaté.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.className} ${playfair.variable}`}>
      <body>
        <AuthProvider>
          <Suspense fallback={null}>
            <AuthRecoveryDetector />
          </Suspense>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
