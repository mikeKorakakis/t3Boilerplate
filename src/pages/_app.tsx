import { useEffect } from "react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { trpc } from "../utils/trpc";

import "react-datepicker/dist/react-datepicker.css";
import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    typeof theme === "string" &&
      document.body.setAttribute("data-theme", JSON.parse(theme));
  }, []);

  return (
    <SessionProvider session={session}>
      <Toaster />
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
