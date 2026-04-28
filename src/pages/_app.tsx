import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserContextProvider } from "@/Contexts/UserContext";
import LoadingScreen from "@/components/LoadingScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <LoadingScreen />
        <Component {...pageProps} />
      </UserContextProvider>
    </QueryClientProvider>
  );
}
