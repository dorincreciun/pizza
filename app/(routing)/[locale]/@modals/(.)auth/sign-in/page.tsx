"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";

import { SignInForm } from "@features/sign-in";
import { ModalShell, useCloseModal } from "@widgets/modal";
import { Modal } from "@shared/ui";

function SignInModalContent() {
    const closeModal = useCloseModal();
    const t = useTranslations("features.signIn.modal");

    return (
        <ModalShell>
            <Modal>
                <Modal.Header>
                    <h2 className="text-lg font-semibold">{t("title")}</h2>
                    <Modal.Close
                        aria-label={t("close")}
                        onClick={closeModal}
                    />
                </Modal.Header>
                <Modal.Body>
                    <SignInForm />
                </Modal.Body>
            </Modal>
        </ModalShell>
    );
}

export default function SignInModal() {
    return (
        <Suspense fallback={null}>
            <SignInModalContent />
        </Suspense>
    );
}
