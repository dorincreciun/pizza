export function getVisibleWindow(
    currentPage: number,
    totalPages: number,
    visiblePages: number,
) {
    const windowSize = Math.max(1, Math.min(visiblePages, totalPages));
    const half = Math.floor(windowSize / 2);
    let start = Math.max(1, currentPage - half);
    let end = start + windowSize - 1;

    if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - windowSize + 1);
    }

    const pages = Array.from(
        { length: end - start + 1 },
        (_, index) => start + index,
    );

    return { start, end, pages, windowSize };
}
