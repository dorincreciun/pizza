import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";

import { getCurrentUser } from "@entities/user";
import { SignInForm } from "@features/sign-in";
import { APP_ROUTES } from "@shared/config";
import { redirect } from "@shared/lib/i18n";
import { getReturnToRoute, resolveReturnTo } from "@shared/lib/routing";
import { Container } from "@shared/ui";

interface SignInPageProps {
    searchParams: Promise<{ returnTo?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
    const t = await getTranslations("features.signIn.modal");
    const user = await getCurrentUser();
    const { returnTo } = await searchParams;
    const resolvedReturnTo = resolveReturnTo(returnTo);

    if (user) {
        const locale = await getLocale();

        redirect({
            href: resolvedReturnTo
                ? getReturnToRoute(resolvedReturnTo)
                : APP_ROUTES.ROOT,
            locale,
        });
    }

    return (
        <Container className="flex min-h-[60vh] items-center justify-center py-12">
            <div className="w-full max-w-md">
                <h1 className="mb-6 text-2xl font-bold text-gray-900">
                    {t("title")}
                </h1>
                <Suspense fallback={null}>
                    <SignInForm />
                </Suspense>
            </div>
        </Container>
    );
}
