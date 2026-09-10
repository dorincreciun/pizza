"use client";

import { Modal, type ModalCloseProps } from "@shared/ui";

import { useCloseModal } from "../lib/use-close-modal";

/**
 * Buton de închidere pentru modale randate prin rutele Next.js `@modals`
 * (interceptare). Navighează explicit la pagina principală.
 */
export const ModalCloseBack = (props: ModalCloseProps) => {
    const closeModal = useCloseModal();

    return <Modal.Close {...props} onClick={closeModal} />;
};
