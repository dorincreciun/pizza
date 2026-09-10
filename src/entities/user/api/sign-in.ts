"use server";

import type { AuthActionResult, SignInInput } from "@entities/user/model/types";
import {
    isValidEmail,
    setSessionCookie,
    verifyPassword,
} from "@shared/lib/auth";
import { prisma } from "@shared/lib/prisma";

export async function signIn(input: SignInInput): Promise<AuthActionResult> {
    const email = input.email.trim().toLowerCase();
    const password = input.password;

    if (!isValidEmail(email)) {
        return { success: false, error: "invalidEmail" };
    }

    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            passwordHash: true,
        },
    });

    if (!user) {
        return { success: false, error: "invalidCredentials" };
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
        return { success: false, error: "invalidCredentials" };
    }

    await setSessionCookie({
        userId: user.id,
        email: user.email,
    });

    return { success: true };
}
