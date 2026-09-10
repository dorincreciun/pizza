"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { LogOut, User } from "lucide-react";

import type { SessionUser } from "@entities/user";
import { signOut } from "@entities/user";
import { APP_ROUTES } from "@shared/config";
import { Link, useRouter } from "@shared/lib/i18n";
import { navigateAfterSignOut } from "@shared/lib/routing";
import { Button, Dropdown } from "@shared/ui";

interface UserMenuProps {
    user: SessionUser;
}

export const UserMenu = ({ user }: UserMenuProps) => {
    const t = useTranslations("features.signIn");
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleSignOut = () => {
        startTransition(async () => {
            await signOut();
            navigateAfterSignOut(router);
            router.refresh();
        });
    };

    return (
        <Dropdown closeOnSelect>
            <Dropdown.Trigger asChild>
                <Button
                    className="max-md:aspect-square max-md:px-0"
                    kind="outline"
                    isLoading={isPending}
                    aria-label={t("userMenuAriaLabel")}
                >
                    <span className="inline-flex items-center gap-2">
                        <User aria-hidden />
                        <span className="max-md:hidden">{t("userMenuLabel")}</span>
                    </span>
                </Button>
            </Dropdown.Trigger>
            <Dropdown.Content align="end" size="md">
                <Dropdown.Item className="cursor-default text-gray-500 hover:bg-transparent hover:text-gray-500">
                    {user.email}
                </Dropdown.Item>
                <Dropdown.Item asChild>
                    <Link href={APP_ROUTES.ORDERS} className="no-underline">
                        {t("ordersLink")}
                    </Link>
                </Dropdown.Item>
                <Dropdown.Item tone="danger" onClick={handleSignOut}>
                    <LogOut aria-hidden className="mr-2 size-4" />
                    {t("signOut")}
                </Dropdown.Item>
            </Dropdown.Content>
        </Dropdown>
    );
};
