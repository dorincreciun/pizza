import type { SessionUser } from "@entities/user";
import { APP_ROUTES } from "@shared/config";
import { Link } from "@shared/lib/i18n";
import { Button } from "@shared/ui";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";

import { UserMenu } from "./user-menu";

interface AuthButtonProps {
    user: SessionUser | null;
}

export const AuthButton = ({ user }: AuthButtonProps) => {
    const t = useTranslations("features.signIn");

    if (user) {
        return <UserMenu user={user} />;
    }

    return (
        <Button asChild className="max-md:aspect-square max-md:px-0">
            <Link href={APP_ROUTES.SIGN_IN} aria-label={t("buttonAriaLabel")}>
                <span className="inline-flex items-center gap-2">
                    <User aria-hidden />
                    <span className="max-md:hidden">{t("buttonText")}</span>
                </span>
            </Link>
        </Button>
    );
};
