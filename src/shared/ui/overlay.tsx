import { cn } from "@shared/utils"

interface OverlayProps {
    /** * Funcție de callback apelată la click pe fundal.
     * Utilizată de obicei pentru închiderea modalei sau a meniului.
     */
    onClick?: () => void
    /** * Clase CSS adiționale pentru personalizarea aspectului (ex: opacitate diferită).
     */
    className?: string
}

/**
 * Componentă de tip fundal semi-transparent (Backdrop) utilizată pentru a izola elementele de tip modal sau dropdown.
 * Blochează interacțiunea cu restul paginii și aplică un efect vizual de blur.
 * @param onClick - Funcția declanșată la interacțiunea cu overlay-ul.
 * @param className - Opțiuni de stilizare adiționale.
 * @example
 * ```tsx
 * {isOpen && <Overlay onClick={closeModal} />}
 * ```
 */
export const Overlay = ({ onClick, className }: OverlayProps) => {
    return (
        <div
            role="presentation"
            className={cn(
                "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]",
                "animate-in fade-in duration-200",
                className,
            )}
            onClick={onClick}
        />
    )
}