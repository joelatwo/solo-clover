import "@/pages/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { KoFiButton } from "@/components/KoFiButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "My App",
  description: "Using Inter font",
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
      <Component {...pageProps} className={inter.variable} />
      <KoFiButton />
    </>
  );
}
