import type { HTMLAttributes } from "react"

import { cn } from "@shared/utils"

/**
 * Componentă de layout pentru centrarea și limitarea lățimii conținutului pe axa orizontală.
 * Implementează un sistem de padding fluid folosind `clamp` pentru adaptabilitate optimă între ecranele mobile și desktop.
 * @param className - Clase CSS adiționale pentru personalizarea containerului.
 * @param rest - Atribute native HTML pentru elementul `div`.
 * @example
 * ```tsx
 * <Container className="py-10">
 *      <p>Conținut centrat</p>
 * </Container>
 * ```
 *  @remarks
 * **Configurație tehnică:**
 * 1. **Max Width**: Limitat la `360` (conform unităților Tailwind configurate, ex: 1440px).
 * 2. **Fluid Padding**: Utilizează formula `clamp(16px, calc((100vw - 390px) * 0.05 + 16px), 32px)`
 * pentru a asigura o tranziție lină a marginilor laterale între breakpoint-uri.
 */
export const Container = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={cn(
                "mx-auto w-full max-w-360 px-[clamp(16px,calc((100vw-390px)*0.05+16px),32px)]",
                className,
            )}
                {...rest}
        />
    )
}