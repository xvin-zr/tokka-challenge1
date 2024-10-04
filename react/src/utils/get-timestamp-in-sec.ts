export function getTimestampInSec(
    time?: string | number | null,
    type: 'start' | 'end' = 'start',
): number {
    if (type === 'end') {
        time = time ?? Date.now();
    } else if (type === 'start') {
        time = time ?? Date.now() - 30 * 24 * 60 * 60 * 1000;
    }

    if (typeof time === 'number') {
        return Math.floor(time / 1000);
    }
    if (typeof time === 'string') {
        time = parseInt(time, 10);
        return Math.floor(time / 1000);
    }
    return Math.floor(Date.now() / 1000);
}
