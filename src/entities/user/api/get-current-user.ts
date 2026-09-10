"use server";

import { UserLanguage } from "@prisma/client";
import { getLocale } from "next-intl/server";

import type { SessionUser } from "@entities/user/model/types";
import { getSessionPayload } from "@shared/lib/auth";
import { prisma } from "@shared/lib/prisma";

export async function getCurrentUser(): Promise<SessionUser | null> {
    const session = await getSessionPayload();

    if (!session) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            id: true,
            email: true,
            language: true,
        },
    });

    if (!user || user.email !== session.email) {
        return null;
    }

    return user;
}

export async function getCurrentUserLocaleLanguage(): Promise<UserLanguage> {
    const locale = await getLocale();

    return locale.toUpperCase() as UserLanguage;
}
