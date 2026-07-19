// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { TelegramProvider } from "@/components/TelegramProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Poker Tracker",
  description: "Track your poker sessions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Load Telegram Web App SDK */}
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive" 
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-100 dark:bg-black`}
      >
        <TelegramProvider>
          {children}
        </TelegramProvider>
      </body>
    </html>
  );
}



// // app/layout.tsx

// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import Script from "next/script";
// import { TelegramProvider } from "@/components/TelegramProvider";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Poker Tracker",
//   description: "Track your poker sessions",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <head>
//         {/* Load Telegram Web App SDK */}
//         <Script 
//           src="https://telegram.org/js/telegram-web-app.js" 
//           strategy="beforeInteractive" 
//         />
//       </head>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//         style={{ backgroundColor: "var(--surface-0)" }}
//       >
//         <TelegramProvider>
//           {children}
//         </TelegramProvider>
//       </body>
//     </html>
//   );
// }
