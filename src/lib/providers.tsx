"use client";
import { store } from "@/redux/store";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <Provider store={store}>
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem>
          {children}
        </ThemeProvider>
      </Provider>
    </ClerkProvider>
  );
}
