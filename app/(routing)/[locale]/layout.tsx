import type {Metadata} from "next";
import { Nunito } from "next/font/google";
import "@app/styles/index.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import {notFound} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import {AppLayout} from "@shared/layouts";
import {routing} from "@shared/lib/i18n";
import { getCurrentUser } from "@entities/user";
import {Header} from "@widgets/header";
import {Cart} from "@widgets/cart";
import { Analytics } from '@vercel/analytics/next'
import {SpeedInsights} from "@vercel/speed-insights/next";

const nunito = Nunito({
    subsets: ["latin", "cyrillic"],
    variable: "--font-nunito",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "Pizza",
        template: "%s | Pizza"
    }
};

interface RootLayoutProps {
    children: ReactNode;
    modals?: ReactNode;
    params: Promise<{locale: string}>
}

export default async function RootLayout({children, modals, params}: RootLayoutProps) {
    const {locale} = await params

    if(!hasLocale(routing.locales, locale)) {
        notFound()
    }

    setRequestLocale(locale)

    const user = await getCurrentUser();

    return (
        <html lang={locale} className={nunito.variable} suppressHydrationWarning>
            <body suppressHydrationWarning>
                <NextIntlClientProvider>
                    <AppLayout>
                        <Header user={user} />
                        {children}

                        {/* Sidebars */}
                        <Cart isAuthenticated={Boolean(user)} />
                    </AppLayout>
                    {modals}

                    {/* Varcel */}
                    <SpeedInsights />
                    <Analytics />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
