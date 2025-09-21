import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { Footer, Header } from "@app/[locale]/_components";
import type { LayoutProps } from "@shared/types";

import "@/shared/styles/globals.css";

import { routing } from "@/shared/lib/i18n/routing";
import { ReduxProvider } from "@/store/provider";

export const metadata: Metadata = {
  title: "PingPong",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<{ locale: string }>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="bg-bg-primary text-base">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReduxProvider>
            <Header />
            {children}
            <Footer />
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
