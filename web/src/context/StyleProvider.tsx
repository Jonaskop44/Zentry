"use client";

import { HeroUIProvider } from "@heroui/react";
import { FC } from "react";
import { Toaster } from "sonner";

interface StyleProviderProps {
  children: React.ReactNode;
}

const StyleProvider: FC<StyleProviderProps> = ({ children }) => {
  return (
    <>
      <HeroUIProvider>
        {children}
        <Toaster position="bottom-right" richColors />
      </HeroUIProvider>
    </>
  );
};

export default StyleProvider;
