// components/TelegramProvider.tsx

"use client";
import { createContext, useContext, useEffect, useState } from "react";

export interface ITelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface ITelegramContext {
  webApp?: any;
  user?: ITelegramUser | null;
}

export const TelegramContext = createContext<ITelegramContext>({});

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<any>(null);
  const [user, setUser] = useState<ITelegramUser | null>(null);

  useEffect(() => {
    const app = (window as any).Telegram?.WebApp;
    if (app) {
      app.ready();
      app.expand(); // Expands the app to full height inside Telegram
      setWebApp(app);
      setUser(app.initDataUnsafe?.user || null);
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ webApp, user }}>
      {children}
    </TelegramContext.Provider>
  );
}

export const useTelegram = () => useContext(TelegramContext);
