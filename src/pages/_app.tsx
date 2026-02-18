import "@/pages/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "My App",
  description: "Using Inter font",
};

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} className={inter.variable} />;
}
