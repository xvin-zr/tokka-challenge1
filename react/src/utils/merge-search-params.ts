/**
 * Merges two search parameters and returns the merged result as a string.
 * 
 * @param current - The current search parameters as a string.
 * @param next - The new search parameters as a string.
 * @returns The merged search parameters as a string.
 */
export function mergeSearchParams(current: string, next: string) {
    const currentSearchParams = new URLSearchParams(current);
    const nextSearchParams = new URLSearchParams(next);

    for (const [key, value] of nextSearchParams.entries()) {
        currentSearchParams.set(key, value);
    }

    return currentSearchParams.toString();
}
