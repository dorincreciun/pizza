import { cookies } from "next/headers";

import {
    createSessionToken,
    SESSION_COOKIE_NAME,
    SESSION_MAX_AGE_SECONDS,
    verifySessionToken,
    type SessionPayload,
} from "./session";

export async function setSessionCookie(payload: SessionPayload) {
    const token = await createSessionToken(payload);
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE_SECONDS,
    });
}

export async function clearSessionCookie() {
    const cookieStore = await cookies();

    cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionPayload() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
        return null;
    }

    return verifySessionToken(token);
}
