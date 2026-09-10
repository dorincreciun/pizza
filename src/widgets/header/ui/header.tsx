"use client"

import {cn} from "@shared/utils";
import {useScrollThreshold} from "@shared/lib/hooks";
import type { SessionUser } from "@entities/user";

import {HeaderLogo} from "./header-logo";
import {HeaderActions} from "./header-actions";
import {Container} from "@shared/ui";

interface HeaderProps {
    user: SessionUser | null;
}

export const Header = ({ user }: HeaderProps) => {
    const isReached = useScrollThreshold(50, {minWidth: 640})

    return (
        <header
            className={cn(
                "sticky top-0 z-30 border-b border-gray-100/80 bg-white/95 backdrop-blur-sm transition-all duration-300 ease-in-out",
                isReached ? "py-3 sm:py-4" : "py-4 sm:py-6 md:py-8",
            )}
        >
            <Container className="flex items-center justify-between gap-4">
                <HeaderLogo />
                <HeaderActions user={user} />
            </Container>
        </header>
    )
};
