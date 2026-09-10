"use server";

import type { AuthActionResult, SignUpInput } from "@entities/user/model/types";
import { getCurrentUserLocaleLanguage } from "@entities/user/api/get-current-user";
import {
    hashPassword,
    isPasswordStrongEnough,
    isValidEmail,
    setSessionCookie,
} from "@shared/lib/auth";
import { prisma } from "@shared/lib/prisma";

export async function signUp(input: SignUpInput): Promise<AuthActionResult> {
    const email = input.email.trim().toLowerCase();
    const password = input.password;
    const confirmPassword = input.confirmPassword;

    if (!isValidEmail(email)) {
        return { success: false, error: "invalidEmail" };
    }

    if (!isPasswordStrongEnough(password)) {
        return { success: false, error: "weakPassword" };
    }

    if (password !== confirmPassword) {
        return { success: false, error: "passwordMismatch" };
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });

    if (existingUser) {
        return { success: false, error: "emailTaken" };
    }

    const passwordHash = await hashPassword(password);
    const language = await getCurrentUserLocaleLanguage();

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            language,
        },
        select: {
            id: true,
            email: true,
        },
    });

    await setSessionCookie({
        userId: user.id,
        email: user.email,
    });

    return { success: true };
}
