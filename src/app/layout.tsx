import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import config from '@/lib/config';

export const metadata: Metadata = {
  title: 'موقع الأخبار - آخر الأخبار والتحديثات',
  description: 'ابق على اطلاع بآخر الأخبار في التكنولوجيا والرياضة والسياسة والأعمال والترفيه والصحة.',
  keywords: ['أخبار', 'آخر الأخبار', 'أخبار عاجلة', 'تكنولوجيا', 'رياضة', 'سياسة'],
  openGraph: {
    title: 'موقع الأخبار - آخر الأخبار والتحديثات',
    description: 'ابق على اطلاع بآخر الأخبار في التكنولوجيا والرياضة والسياسة والأعمال والترفيه والصحة.',
    type: 'website',
    images: [config.seo.ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@newswebsite',
    title: 'موقع الأخبار - آخر الأخبار والتحديثات',
    description: 'ابق على اطلاع بآخر الأخبار في التكنولوجيا والرياضة والسياسة والأعمال والترفيه والصحة.',
    images: [config.seo.ogImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster 
            position="top-left"
            toastOptions={{
              style: {
                fontFamily: 'Noto Sans Arabic, sans-serif',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
} 