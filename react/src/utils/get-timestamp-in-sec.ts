export function getTimestampInSec(
    time?: string | number | null,
    type: 'start' | 'end' = 'start',
): number {
    if (type === 'end') {
        time = time ?? Date.now();
    } else if (type === 'start') {
        time = time ?? Date.now() - 30 * 24 * 60 * 60 * 1000;
    }

    let timestamp: number;

    if (typeof time === 'number') {
        timestamp = Math.floor(time / 1000);
    } else if (typeof time === 'string') {
        const parsed = parseInt(time, 10);
        if (isNaN(parsed)) {
            timestamp = Math.floor(Date.now() / 1000);
        } else {
            timestamp = Math.floor(parsed / 1000);
        }
    } else {
        timestamp = Math.floor(Date.now() / 1000);
    }

    if (type === 'end') {
        timestamp += 24 * 60 * 60;
    }

    return timestamp;
}
