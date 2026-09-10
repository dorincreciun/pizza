import type { JWTPayload } from "jose";

export const SESSION_COOKIE_NAME = "pizza_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export interface SessionPayload extends JWTPayload {
    userId: string;
    email: string;
}

function getAuthSecret() {
    const secret = process.env.AUTH_SECRET;

    if (!secret) {
        throw new Error("AUTH_SECRET is not configured");
    }

    return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload) {
    const { SignJWT } = await import("jose");

    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
        .sign(getAuthSecret());
}

export async function verifySessionToken(
    token: string,
): Promise<SessionPayload | null> {
    try {
        const { jwtVerify } = await import("jose");
        const { payload } = await jwtVerify(token, getAuthSecret());

        if (
            typeof payload.userId !== "string" ||
            typeof payload.email !== "string"
        ) {
            return null;
        }

        return {
            userId: payload.userId,
            email: payload.email,
        };
    } catch {
        return null;
    }
}
