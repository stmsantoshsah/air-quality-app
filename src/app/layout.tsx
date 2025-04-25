// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import CustomThemeProvider from '@/providers/ThemeProvider';
import './../styles/globals.css';
import ClientLayout from '@/components/ClientLayout';
import '../styles/globals.css';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Air Quality App',
  description: 'Check real-time air quality and weather information.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <CustomThemeProvider>
            <ClientLayout>{children}</ClientLayout>
          </CustomThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
