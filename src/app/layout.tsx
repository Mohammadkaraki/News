import './globals.css';
import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import config from '@/lib/config';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
});

export const metadata: Metadata = {
  title: config.seo.defaultTitle,
  description: config.seo.defaultDescription,
  keywords: config.seo.defaultKeywords,
  openGraph: {
    title: config.seo.defaultTitle,
    description: config.seo.defaultDescription,
    type: 'website',
    images: [config.seo.ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    site: config.seo.twitterHandle,
    title: config.seo.defaultTitle,
    description: config.seo.defaultDescription,
    images: [config.seo.ogImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
} 