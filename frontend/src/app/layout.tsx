import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ColorProvider } from "@/components/color-provider";

import { AuthProvider } from "@/contexts/auth-context"
import { PatientProvider } from "@/contexts/patient-context";
import { ColorThemeProvider } from "@/contexts/color-theme-context";
import QueryProvider from "@/components/query-provider"
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriXpertPro",
  description: "Sistema Avançado de Nutrição",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NutriXpert",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: "#0d1117",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ColorProvider>
            <ColorThemeProvider>
              <AuthProvider>
                <PatientProvider>
                  <QueryProvider>
                    {children}
                    <Toaster position="top-right" richColors closeButton />
                  </QueryProvider>
                </PatientProvider>
              </AuthProvider>
            </ColorThemeProvider>
          </ColorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
