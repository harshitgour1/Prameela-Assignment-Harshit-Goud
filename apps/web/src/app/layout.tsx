import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });


export const metadata = {
  title: 'Companies - Prameela OneSuite',
  description: 'Company Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
