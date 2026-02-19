import { Inter, Playfair_Display } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RadioPlayer from "@/components/layout/RadioPlayer";
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
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Ubatexas Logo',
      }
    ],
  },
  alternates: {
    canonical: 'https://ubatexas.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ubatexas',
    description: 'Digital Media & Lifestyle en la Provincia de Ubaté.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }) {
  // 1. JSON-LD Schemas
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ubatexas",
    "url": "https://ubatexas.com",
    "logo": "https://ubatexas.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "areaServed": "CO",
      "availableLanguage": "Spanish"
    },
    "sameAs": [
      "https://www.instagram.com/ubatexasoficial/",
      "https://www.facebook.com/profile.php?id=61587895797422"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ubatexas",
    "url": "https://ubatexas.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://ubatexas.com/gente?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

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
          <RadioPlayer />
        </AuthProvider>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </body>
    </html>
  );
}
