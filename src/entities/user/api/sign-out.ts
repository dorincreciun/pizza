"use server";

import type { AuthActionResult } from "@entities/user/model/types";
import { clearSessionCookie } from "@shared/lib/auth";

export async function signOut(): Promise<AuthActionResult> {
    await clearSessionCookie();

    return { success: true };
}
