export function mergeSearchParams(current: string, next: string) {
    const currentSearchParams = new URLSearchParams(current);
    const nextSearchParams = new URLSearchParams(next);

    for (const [key, value] of nextSearchParams.entries()) {
        currentSearchParams.set(key, value);
    }

    return currentSearchParams.toString();
}
