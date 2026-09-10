import type { SessionUser } from "@entities/user";
import { AuthButton } from "@features/sign-in";
import { SelectLanguage } from "@features/select-language";
import { ToggleCartButton } from "@features/toggle-cart";

interface HeaderActionsProps {
    user: SessionUser | null;
}

export const HeaderActions = ({ user }: HeaderActionsProps) => {
    return (
        <div className="flex items-center gap-4">
            <SelectLanguage />
            <ToggleCartButton />
            <AuthButton user={user} />
        </div>
    );
};
