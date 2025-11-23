import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "../src/shared/components/theme";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title:
    "Task Mental | Sua plataforma de mapas mentais para desenvolvimento de software frontend",
  description:
    "Task Mental é uma plataforma de mapas mentais para desenvolvimento de software frontend. Ele ajuda você a criar, gerenciar e compartilhar mapas mentais para desenvolvimento de software frontend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
