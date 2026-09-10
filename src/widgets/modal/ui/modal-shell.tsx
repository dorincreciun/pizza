"use client";

import { Suspense, type ReactNode } from "react";

import { Overlay } from "@shared/ui/overlay";

import { useCloseModal } from "../lib/use-close-modal";

export type ModalShellProps = {
    children: ReactNode;
    className?: string;
};

const ModalShellInner = ({ children, className }: ModalShellProps) => {
    const closeModal = useCloseModal();

    return (
        <div className={className ?? "fixed inset-0 z-50"}>
            <Overlay onClick={closeModal} className="z-10" />
            <div className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center p-4">
                <div
                    className="pointer-events-auto flex w-full justify-center"
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export const ModalShell = ({ children, className }: ModalShellProps) => (
    <Suspense fallback={null}>
        <ModalShellInner className={className}>{children}</ModalShellInner>
    </Suspense>
);
