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

/**
 * Calculates the start and end timestamps based on the provided start and end parameters.
 * If the start parameter is not provided or is invalid, it defaults to 30 days ago.
 * If the end parameter is not provided or is invalid, it defaults to the current timestamp.
 *
 * @param startParam - The start parameter as a string or null.
 * @param endParam - The end parameter as a string or null.
 * @returns An object containing the start and end timestamps.
 */
export function getParamsTimestamp(
    startParam: string | null,
    endParam: string | null,
) {
    // Calculate the start timestamp
    const start =
        Number(startParam ?? 0) ||
        Math.floor(Date.now() / 1000 - 30 * 24 * 60 * 60);

    // Calculate the end timestamp
    const end = Number(endParam ?? 0) || Math.floor(Date.now() / 1000);

    // Return an object containing the start and end timestamps
    return {
        start,
        end,
    };
}
