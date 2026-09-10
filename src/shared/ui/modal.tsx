import type {ComponentProps, HTMLAttributes} from "react";

import {Button} from "@shared/ui/button";
import {cn} from "@shared/utils";
import {X} from "lucide-react";

// --- TYPES ---

const modalDefaultClassName =
    "w-full max-w-[400px]";

export type ModalProps = HTMLAttributes<HTMLDivElement>;

export type ModalHeaderProps = HTMLAttributes<HTMLDivElement>;

export type ModalCloseProps = ComponentProps<typeof Button>;

export type ModalBodyProps = HTMLAttributes<HTMLDivElement>;

export type ModalFooterProps = HTMLAttributes<HTMLDivElement>;

export type ModalDividerProps = HTMLAttributes<HTMLDivElement>;

// --- COMPONENT ---

/**
 * Panoul principal al modalei (compound root). Randează un container `role="dialog"` cu
 * `aria-modal="true"`, lățime implicită 400px și structură flex pe verticală.
 * Nu include overlay sau logică de închidere — pentru rutele Next.js `@modals` folosește
 * `ModalShell` din `@widgets/modal`.
 * @param className - Clase CSS adiționale (Tailwind). Implicit: `max-w-[400px]`; ex. `max-w-lg` sau `w-[480px]` pentru altă lățime.
 * @param children - Subcomponente compuse (`Modal.Header`, `Modal.Body`, etc.).
 * @param rest - Restul atributelor native HTML pentru elementul `div` (ex: `id`, `aria-labelledby`).
 * @remarks
 * **Structură recomandată:**
 * 1. `Modal.Close` — poziționat absolut în colțul din dreapta-sus al panoului.
 * 2. `Modal.Header` — titlu sau acțiuni; are padding rezervat pentru butonul de închidere.
 * 3. `Modal.Body` — conținut scrollabil.
 * 4. `Modal.Footer` — acțiuni secundare (opțional).
 * 5. `Modal.Divider` — separator vizual între secțiuni (opțional).
 * @example
 * ```tsx
 * <Modal className="max-w-lg">
 *   <Modal.Close aria-label="Închide" onClick={close} />
 *   <Modal.Header>
 *     <h2 className="text-lg font-semibold">Titlu</h2>
 *   </Modal.Header>
 *   <Modal.Body>Conținut</Modal.Body>
 *   <Modal.Footer>
 *     <Button onClick={close}>OK</Button>
 *   </Modal.Footer>
 * </Modal>
 * ```
 */
const ModalRoot = ({className, children, ...rest}: ModalProps) => (
    <div
        role="dialog"
        aria-modal="true"
        className={cn(
            "relative z-50 flex max-h-[min(90dvh,720px)] flex-col overflow-hidden",
            "rounded-2xl bg-white shadow-xl",
            "animate-in fade-in zoom-in-95 duration-200",
            modalDefaultClassName,
            className,
        )}
        {...rest}
    >
        {children}
    </div>
);

/**
 * Antetul modalei: aliniere flex, padding standard și spațiu rezervat (`pr-14`) pentru `Modal.Close`.
 * @param className - Clase CSS adiționale pentru zona de antet.
 * @param children - Titlu, subtitlu sau acțiuni (ex: `<h2>`, butoane).
 * @param rest - Atribute native HTML pentru elementul `div`.
 * @example
 * ```tsx
 * <Modal.Header>
 *   <h2 className="text-lg font-semibold">{t("title")}</h2>
 * </Modal.Header>
 * ```
 */
const ModalHeader = ({children, className, ...rest}: ModalHeaderProps) => (
    <div
        className={cn(
            "flex shrink-0 items-center justify-between gap-4",
            "px-6 pt-6 pb-4 pr-14",
            className,
        )}
        {...rest}
    >
        {children}
    </div>
);

/**
 * Buton de închidere pentru modală. Extinde API-ul componentei `Button` (variante, `asChild`, etc.).
 * Iconița `X` este afișată implicit dacă nu trimiți `children`. Traducerile (`aria-label`) se dau din exterior.
 * @param className - Clase CSS adiționale; se combină cu poziționarea absolută `right-4 top-4`.
 * @param children - Conținut custom (ex: text „Închide”). Dacă lipsește, se randează iconița `X`.
 * @param onlyIcon - Dacă nu e setat: `true` fără `children`, `false` cu `children`. Poate fi forțat explicit.
 * @param type - Tip HTML al butonului. Implicit: `button`.
 * @param kind - Stilul vizual al butonului. Implicit: `ghost`.
 * @param size - Dimensiunea butonului. Implicit: `sm`.
 * @param asChild - Dacă este `true`, stilurile se aplică pe un singur copil prin Radix `Slot` (la fel ca `Button`).
 * @param rest - Restul props-urilor `Button` (ex: `onClick`, `aria-label`, `disabled`).
 * @remarks
 * Plasează `Modal.Close` ca prim copil al lui `Modal` pentru stratificare corectă (`z-10` peste conținut).
 * @example
 * ```tsx
 * <Modal.Close aria-label={t("close")} onClick={() => router.back()} />
 * ```
 */
const ModalClose = ({
                        className,
                        children,
                        onlyIcon,
                        type = "button",
                        kind = "ghost",
                        size = "sm",
                        ...rest
                    }: ModalCloseProps) => {
    const hasCustomChildren = children !== undefined;
    const resolvedOnlyIcon = onlyIcon ?? !hasCustomChildren;

    return (
        <Button
            type={type}
            kind={kind}
            size={size}
            className={cn("absolute right-4 top-4 z-10", className)}
            onlyIcon={resolvedOnlyIcon}
            {...rest}
        >
            {children ?? <X aria-hidden/>}
        </Button>
    );
};

/**
 * Zona principală de conținut a modalei, cu scroll vertical când depășește înălțimea panoului.
 * @param className - Clase CSS adiționale pentru corpul modalei.
 * @param children - Formulare, text, liste sau orice conținut principal.
 * @param rest - Atribute native HTML pentru elementul `div`.
 * @example
 * ```tsx
 * <Modal.Body>
 *   <p>{t("description")}</p>
 * </Modal.Body>
 * ```
 */
const ModalBody = ({className, children, ...rest}: ModalBodyProps) => (
    <div
        className={cn(
            "flex min-h-0 flex-1 flex-col items-stretch overflow-y-auto",
            "px-6 pb-6",
            className,
        )}
        {...rest}
    >
        {children}
    </div>
);

/**
 * Subsolul modalei pentru acțiuni (confirmare, anulare). Aliniere la dreapta, border superior și padding fix.
 * @param className - Clase CSS adiționale pentru subsol.
 * @param children - Butoane sau alte controale de acțiune.
 * @param rest - Atribute native HTML pentru elementul `div`.
 * @example
 * ```tsx
 * <Modal.Footer>
 *   <Button kind="outline" onClick={close}>{t("cancel")}</Button>
 *   <Button color="primary" onClick={submit}>{t("save")}</Button>
 * </Modal.Footer>
 * ```
 */
const ModalFooter = ({className, children, ...rest}: ModalFooterProps) => (
    <div
        className={cn(
            "flex shrink-0 items-center justify-end gap-3",
            "border-t border-gray-200 px-6 py-4",
            className,
        )}
        {...rest}
    >
        {children}
    </div>
);

/**
 * Separator orizontal între secțiuni din interiorul modalei (`role="separator"`).
 * @param className - Clase CSS adiționale pentru linia de separare.
 * @param rest - Atribute native HTML pentru elementul `div`.
 * @example
 * ```tsx
 * <Modal.Divider />
 * ```
 */
const ModalDivider = ({className, ...rest}: ModalDividerProps) => (
    <div
        role="separator"
        className={cn("mx-6 border-t border-gray-200", className)}
        {...rest}
    />
);

type ModalCompound = typeof ModalRoot & {
    Header: typeof ModalHeader;
    Close: typeof ModalClose;
    Body: typeof ModalBody;
    Footer: typeof ModalFooter;
    Divider: typeof ModalDivider;
};

ModalRoot.displayName = "Modal";

export const Modal = ModalRoot as ModalCompound;

ModalHeader.displayName = "Modal.Header";
ModalClose.displayName = "Modal.Close";
ModalBody.displayName = "Modal.Body";
ModalFooter.displayName = "Modal.Footer";
ModalDivider.displayName = "Modal.Divider";

Modal.Header = ModalHeader;
Modal.Close = ModalClose;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.Divider = ModalDivider;