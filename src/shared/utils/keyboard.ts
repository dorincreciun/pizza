import type { KeyboardEvent as ReactKeyboardEvent } from "react";

/** Taste folosite frecvent în UI (meniuri, modale, formulare). */
export const KEY = {
    Escape: "Escape",
    Enter: "Enter",
    Space: " ",
} as const;

export type KeyboardKey = (typeof KEY)[keyof typeof KEY];

export function isEscapeKey(event: { key: string }): boolean {
    return event.key === KEY.Escape;
}

export function isEnterKey(event: { key: string }): boolean {
    return event.key === KEY.Enter;
}

export function isSpaceKey(event: { key: string }): boolean {
    return event.key === KEY.Space;
}

/** Enter sau Space — activare element interactiv (meniu, buton custom). */
export function isActivationKey(event: { key: string }): boolean {
    return isEnterKey(event) || isSpaceKey(event);
}

export type DocumentKeyDownHandlers = {
    /** Apelat la `Escape` (închidere modale, dropdown-uri etc.). */
    onEscape?: () => void;
    /** Handlere per tastă, ex. `{ ArrowDown: () => ... }`. */
    onKey?: Partial<Record<string, (event: KeyboardEvent) => void>>;
};

/**
 * Factory pentru listener pe `document` (keydown).
 * Folosește cu `subscribeDocumentKeyDown` sau în `useEffect`.
 */
export function createDocumentKeyDownHandler(
    handlers: DocumentKeyDownHandlers,
): (event: KeyboardEvent) => void {
    return (event: KeyboardEvent) => {
        if (isEscapeKey(event) && handlers.onEscape) {
            handlers.onEscape();
            return;
        }

        const keyHandler = handlers.onKey?.[event.key];
        if (keyHandler) {
            keyHandler(event);
        }
    };
}

/** Înregistrează listener pe document; returnează funcția de cleanup. */
export function subscribeDocumentKeyDown(
    handler: (event: KeyboardEvent) => void,
): () => void {
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
}

/**
 * Abonare document keydown cu handlere declarative.
 * @returns cleanup — potrivit pentru `useEffect(() => bindDocumentKeyDown(...), deps)`.
 */
export function bindDocumentKeyDown(
    handlers: DocumentKeyDownHandlers,
): () => void {
    return subscribeDocumentKeyDown(
        createDocumentKeyDownHandler(handlers),
    );
}

/**
 * Activează acțiunea la Enter / Space (item meniu, rând selectabil).
 */
export function handleActivationKeyDown<E extends HTMLElement>(
    event: ReactKeyboardEvent<E>,
    onActivate: (event: ReactKeyboardEvent<E>) => void,
): void {
    if (!isActivationKey(event)) return;
    event.preventDefault();
    onActivate(event);
}
