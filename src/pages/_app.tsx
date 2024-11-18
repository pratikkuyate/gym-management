import "@/styles/globals.css";
import type { AppProps } from "next/app";
import 'bootstrap/dist/css/bootstrap.min.css';
import { SessionProvider } from "next-auth/react";
// import NavBar from "@/components/Layout/NavBar";
import Layout from "@/components/Layout";
import { NextComponentType } from 'next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type AppPropsWithLayout = AppProps & {
  Component: NextComponentType & { layout?: boolean };
};
const queryClient = new QueryClient();

function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <SessionProvider session={session}>
        <NavBarWrap wrap={Component?.layout}>
          <Component {...pageProps} />
        </NavBarWrap>
      </SessionProvider>
    </QueryClientProvider>
  );
}

function NavBarWrap({ children, wrap }: { children: React.ReactNode; wrap?: boolean }) {
  if (wrap) {
    return <Layout>{children}</Layout>;
  }
  return children;
}

export default App
