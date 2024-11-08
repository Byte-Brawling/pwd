"use client";
import { store } from "@/redux/store";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { createUser } from "./actions";
import { useEffect } from "react";


function AuthSync() {
  useEffect(() => {
    const syncUser = async () => {
      await createUser();
    };

    syncUser();
  }, []);

  return null;
}
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <Provider store={store}>
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem>
          <AuthSync/>/
          {children}
        </ThemeProvider>
      </Provider>
    </ClerkProvider>
  );
}
