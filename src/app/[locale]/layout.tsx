import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Providers } from '@/app/providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '@/app/globals.css';
import { Toaster } from 'react-hot-toast';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: 'Kulturföreningen',
    description: 'En gemenskap för kultur, evenemang och engagemang',
  };
}

export function generateStaticParams() {
  return [
    { locale: 'sv' },
    { locale: 'en' },
    { locale: 'tr' },
  ];
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Toaster position="top-right" />
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}