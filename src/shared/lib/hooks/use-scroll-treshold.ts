"use client"

import { useState, useEffect } from "react"

interface UseScrollThresholdOptions {
    /** Activează logica doar de la această lățime (inclusiv). */
    minWidth?: number
    /** Activează logica doar până la această lățime (inclusiv). */
    maxWidth?: number
}

/**
 * Hook care returnează true dacă scroll-ul vertical depășește o anumită valoare.
 * @param threshold - Distanța în pixeli (default 50)
 * @param options - Interval opțional de lățimi în care hook-ul este activ
 */
export const useScrollThreshold = (
    threshold: number = 50,
    options: UseScrollThresholdOptions = {},
) => {
    const [isExceeded, setIsExceeded] = useState(false)
    const { minWidth, maxWidth } = options

    useEffect(() => {
        const isWithinWidthRange = () => {
            const width = window.innerWidth
            const meetsMin = minWidth === undefined || width >= minWidth
            const meetsMax = maxWidth === undefined || width <= maxWidth

            return meetsMin && meetsMax
        }

        const handleScroll = () => {
            if (!isWithinWidthRange()) {
                setIsExceeded(false)
                return
            }

            const scrolled = window.scrollY > threshold
            setIsExceeded((prev) => (prev !== scrolled ? scrolled : prev))
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        window.addEventListener("resize", handleScroll)

        handleScroll()

        return () => {
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("resize", handleScroll)
        }
    }, [maxWidth, minWidth, threshold])

    return isExceeded
}