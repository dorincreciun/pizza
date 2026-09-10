import type { UserLanguage } from "@prisma/client";

export type SessionUser = {
    id: string;
    email: string;
    language: UserLanguage;
};

export type AuthActionResult =
    | { success: true }
    | { success: false; error: AuthErrorCode };

export type AuthErrorCode =
    | "invalidEmail"
    | "invalidCredentials"
    | "weakPassword"
    | "passwordMismatch"
    | "emailTaken"
    | "unknown";

export type SignInInput = {
    email: string;
    password: string;
};

export type SignUpInput = {
    email: string;
    password: string;
    confirmPassword: string;
};
