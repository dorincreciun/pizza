"use client";

import {
    createContext,
    type HTMLAttributes,
    type ReactElement,
    type ReactNode,
    type RefObject,
    type JSX,
    useCallback,
    useContext,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import { cn } from "@shared/utils";

// --- CONSTANTS ---

const PRIORITY_SAFETY_BUFFER_PX = 20;
const PRIORITY_SKELETON_SLOT_COUNT = 6;

// --- TYPES ---

type PriorityNavigationContextValue = {
    containerRef: RefObject<HTMLDivElement | null>;
    moreButtonRef: RefObject<HTMLDivElement | null>;
    itemsRef: RefObject<Map<string, HTMLElement>>;
};

export type PriorityNavigationRootProps = {
    children: ReactNode;
};

export type PriorityNavigationMainProps<T> = HTMLAttributes<HTMLDivElement> & {
    /** Lista completă de elemente de randat. */
    items: T[];
    /** Randare pentru un element vizibil în bară. */
    renderItem: (item: T) => ReactElement;
    /** Randare pentru acțiunea „Mai mult” (restul elementelor). */
    renderMore: (items: T[]) => ReactElement | null;
    /** Înălțime fixă a containerului (evită layout shift la calcul). */
    height: number;
    /**
     * Lățime disponibilă (px, fără padding/border) sub care toate elementele
     * merg în dropdown (0 vizibile în bară).
     */
    allInDropdownBelowWidth?: number;
};

export type UsePriorityNavigationProps<T> = {
    items: T[];
    containerRef: RefObject<HTMLElement | null>;
    itemsRef: RefObject<Map<string, HTMLElement>>;
    moreButtonRef: RefObject<HTMLDivElement | null>;
    allInDropdownBelowWidth?: number;
};

export type UsePriorityNavigationResult<T> = {
    visibleItems: T[];
    overflowItems: T[];
    isReady: boolean;
};

// --- UTILS ---

/**
 * Calculează lățimea intrinsecă a unui element, fără impact vizual în layout.
 */
export function calculateIntrinsicWidth<T extends HTMLElement>(element: T): number {
    const original = element.style.cssText;

    element.style.display = "inline-block";
    element.style.width = "max-content";
    element.style.whiteSpace = "nowrap";
    element.style.position = "absolute";
    element.style.visibility = "hidden";

    const width = element.getBoundingClientRect().width;
    element.style.cssText = original;

    return width;
}

// --- CONTEXT ---

const PriorityNavigationContext =
    createContext<PriorityNavigationContextValue | null>(null);

const usePriorityNavigationContext = () => {
    const context = useContext(PriorityNavigationContext);
    if (!context) {
        throw new Error(
            "Sub-componentele PriorityNavigation.* trebuie folosite în interiorul <PriorityNavigation />.",
        );
    }
    return context;
};

// --- HOOKS ---

/**
 * Algoritm de overflow orizontal: calculează elementele vizibile vs. „Mai mult”.
 */
export function usePriorityNavigation<T>({
    items,
    containerRef,
    itemsRef,
    moreButtonRef,
    allInDropdownBelowWidth,
}: UsePriorityNavigationProps<T>): UsePriorityNavigationResult<T> {
    const [isReady, setIsReady] = useState(false);
    const [visibleItems, setVisibleItems] = useState<T[]>([]);
    const [overflowItems, setOverflowItems] = useState<T[]>([]);

    const calculate = useCallback(() => {
        const container = containerRef.current;
        const moreButton = moreButtonRef.current;

        if (!container || !moreButton || items.length === 0) {
            return;
        }

        const elements: HTMLElement[] = [];
        for (let index = 0; index < items.length; index++) {
            const element = itemsRef.current.get(String(index));
            if (!element) {
                return;
            }
            elements.push(element);
        }

        const containerStyle = window.getComputedStyle(container);
        const paddingX =
            parseFloat(containerStyle.paddingLeft) +
            parseFloat(containerStyle.paddingRight);
        const borderX =
            parseFloat(containerStyle.borderLeftWidth) +
            parseFloat(containerStyle.borderRightWidth);

        const availableWidth =
            container.getBoundingClientRect().width - paddingX - borderX;

        if (availableWidth <= 0) {
            return;
        }

        if (
            allInDropdownBelowWidth != null &&
            availableWidth <= allInDropdownBelowWidth
        ) {
            setVisibleItems([]);
            setOverflowItems(items);
            setIsReady(true);
            return;
        }

        const moreButtonWidth =
            calculateIntrinsicWidth(moreButton) + PRIORITY_SAFETY_BUFFER_PX;

        let usedWidth = 0;
        let visibleCount = 0;

        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            const itemWidth = calculateIntrinsicWidth(element);
            const needsMoreButton = index < elements.length - 1;
            const totalWidth =
                itemWidth + (needsMoreButton ? moreButtonWidth : 0);

            if (usedWidth + totalWidth <= availableWidth) {
                usedWidth += itemWidth;
                visibleCount++;
            } else {
                break;
            }
        }

        setVisibleItems(items.slice(0, visibleCount));
        setOverflowItems(items.slice(visibleCount));
        setIsReady(true);
    }, [
        items,
        containerRef,
        itemsRef,
        moreButtonRef,
        allInDropdownBelowWidth,
    ]);

    useLayoutEffect(() => {
        const validKeys = new Set(items.map((_, index) => String(index)));
        for (const key of itemsRef.current.keys()) {
            if (!validKeys.has(key)) {
                itemsRef.current.delete(key);
            }
        }
    }, [items, itemsRef]);

    useLayoutEffect(() => {
        let frameId = 0;

        const runCalculate = () => {
            calculate();
        };

        runCalculate();

        const observer = new ResizeObserver(runCalculate);
        const container = containerRef.current;

        if (container) {
            observer.observe(container);
        }

        const retryUntilMeasured = () => {
            const container = containerRef.current;
            const moreButton = moreButtonRef.current;
            const refsReady =
                items.length === 0 ||
                items.every((_, index) =>
                    itemsRef.current.has(String(index)),
                );

            if (
                container &&
                moreButton &&
                refsReady &&
                container.getBoundingClientRect().width > 0
            ) {
                runCalculate();
                return;
            }

            frameId = requestAnimationFrame(retryUntilMeasured);
        };

        frameId = requestAnimationFrame(retryUntilMeasured);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(frameId);
        };
    }, [calculate, containerRef, items, itemsRef, moreButtonRef]);

    return { visibleItems, overflowItems, isReady };
};

/** @deprecated Folosește `usePriorityNavigationContext`. */
export const usePriorityContext = usePriorityNavigationContext;

// --- COMPONENT ---

/**
 * Provider: referințe partajate pentru container, itemi și butonul „Mai mult”.
 */
const PriorityNavigationRoot = ({ children }: PriorityNavigationRootProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const moreButtonRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<Map<string, HTMLElement>>(new Map());

    return (
        <PriorityNavigationContext.Provider
            value={{ containerRef, moreButtonRef, itemsRef }}
        >
            {children}
        </PriorityNavigationContext.Provider>
    );
};

/**
 * Bara de navigare cu overflow automat. Măsoară itemii într-o zonă invizibilă,
 * apoi afișează doar ce încape; restul merge în `renderMore`.
 */
function PriorityNavigationMain<T>({
    items,
    renderItem,
    renderMore,
    className,
    height,
    allInDropdownBelowWidth,
    style,
    ...rest
}: PriorityNavigationMainProps<T>) {
    const { containerRef, itemsRef, moreButtonRef } =
        usePriorityNavigationContext();

    const { visibleItems, overflowItems, isReady } = usePriorityNavigation<T>({
        items,
        containerRef,
        itemsRef,
        moreButtonRef,
        allInDropdownBelowWidth,
    });

    return (
        <div
            ref={containerRef}
            className={cn("relative", className)}
            style={{ ...style, height }}
            {...rest}
        >
            {!isReady && (
                <div
                    className="flex size-full items-center justify-around gap-2 overflow-hidden"
                    aria-hidden
                >
                    {Array.from({ length: PRIORITY_SKELETON_SLOT_COUNT }).map(
                        (_, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "h-full shrink-0 animate-pulse rounded-2xl bg-[#F0F0F0]",
                                    index % 2 === 0 ? "w-24" : "w-32",
                                )}
                            />
                        ),
                    )}
                </div>
            )}

            {isReady && (
                <div className="flex h-full min-w-0 flex-1 items-center gap-2">
                    {visibleItems.map(renderItem)}
                    {overflowItems.length > 0 && renderMore(overflowItems)}
                </div>
            )}

            <div
                className="pointer-events-none invisible absolute top-0 left-0 -z-10 h-0 w-0 overflow-hidden opacity-0"
                aria-hidden
            >
                <div ref={moreButtonRef} className="shrink-0">
                    {renderMore([])}
                </div>

                {items.map((item, index) => (
                    <div
                        key={index}
                        ref={(element) => {
                            const key = index.toString();
                            if (element) {
                                itemsRef.current.set(key, element);
                            } else {
                                itemsRef.current.delete(key);
                            }
                        }}
                        className="shrink-0"
                    >
                        {renderItem(item)}
                    </div>
                ))}
            </div>
        </div>
    );
}

type PriorityNavigationMainComponent = <T>(
    props: PriorityNavigationMainProps<T>,
) => JSX.Element;

type PriorityNavigationCompound = typeof PriorityNavigationRoot & {
    Main: PriorityNavigationMainComponent;
};

PriorityNavigationRoot.displayName = "PriorityNavigation";

/**
 * Navigare orizontală cu overflow („Mai mult”) — Client Component.
 * @example
 * ```tsx
 * <PriorityNavigation>
 *   <PriorityNavigation.Main
 *     items={categories}
 *     height={48}
 *     allInDropdownBelowWidth={480}
 *     renderItem={(category) => (
 *       <CategoryLink key={category.id} category={category} />
 *     )}
 *     renderMore={(overflow) => (
 *       <CategoriesDropdown categories={overflow} />
 *     )}
 *   />
 * </PriorityNavigation>
 * ```
 */
export const PriorityNavigation =
    PriorityNavigationRoot as PriorityNavigationCompound;

PriorityNavigation.Main = PriorityNavigationMain;

PriorityNavigationMain.displayName = "PriorityNavigation.Main";
