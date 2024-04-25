"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <div className="flex h-screen items-center justify-center overflow-hidden bg-muted/50">
          {children}
        </div>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
