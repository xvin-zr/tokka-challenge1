// utils.test.ts
import { getTimestampInSec } from './get-timestamp-in-sec';
import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

describe('getTimestampInSec', () => {
    beforeAll(() => {
        vitest.spyOn(Date, 'now').mockImplementation(() => fixedDate);
    });

    afterAll(() => {
        vitest.restoreAllMocks();
    });

    const fixedDate = new Date().getTime();

    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const THIRTY_DAYS_AGO = fixedDate - THIRTY_DAYS_MS;
    const THIRTY_DAYS_AGO_SEC = Math.floor(THIRTY_DAYS_AGO / 1000);
    const FIXED_DATE_SEC = Math.floor(fixedDate / 1000); // Default 'start' type with undefined time

    it('should return timestamp for 30 days ago when type is "start" and time is undefined', () => {
        expect(getTimestampInSec()).toBe(THIRTY_DAYS_AGO_SEC);
    }); // 'start' type with null time

    it('should return timestamp for 30 days ago when type is "start" and time is null', () => {
        expect(getTimestampInSec(null, 'start')).toBe(THIRTY_DAYS_AGO_SEC);
    }); // 'end' type with undefined time

    it('should return current timestamp when type is "end" and time is undefined', () => {
        expect(getTimestampInSec(undefined, 'end')).toBe(FIXED_DATE_SEC);
    }); // 'end' type with null time

    it('should return current timestamp when type is "end" and time is null', () => {
        expect(getTimestampInSec(null, 'end')).toBe(FIXED_DATE_SEC);
    }); // 'start' type with numeric time

    it('should convert numeric time to seconds for type "start"', () => {
        const time = fixedDate - 15 * 24 * 60 * 60 * 1000; // 15 days ago
        const expected = Math.floor(time / 1000);
        expect(getTimestampInSec(time, 'start')).toBe(expected);
    }); // 'end' type with numeric time

    it('should convert numeric time to seconds for type "end"', () => {
        const time = fixedDate - 10 * 24 * 60 * 60 * 1000; // 10 days ago
        const expected = Math.floor(time / 1000);
        expect(getTimestampInSec(time, 'end')).toBe(expected);
    }); // 'start' type with string time

    it('should convert string time to seconds for type "start"', () => {
        const time = (fixedDate - 20 * 24 * 60 * 60 * 1000).toString(); // 20 days ago
        const expected = Math.floor(
            (fixedDate - 20 * 24 * 60 * 60 * 1000) / 1000,
        );
        expect(getTimestampInSec(time, 'start')).toBe(expected);
    }); // 'end' type with string time

    it('should convert string time to seconds for type "end"', () => {
        const time = (fixedDate - 5 * 24 * 60 * 60 * 1000).toString(); // 5 days ago
        const expected = Math.floor(
            (fixedDate - 5 * 24 * 60 * 60 * 1000) / 1000,
        );
        expect(getTimestampInSec(time, 'end')).toBe(expected);
    }); // Invalid string input

    it('should return NaN when string time is invalid', () => {
        const invalidTime = 'invalid';
        expect(getTimestampInSec(invalidTime, 'start')).toBeNaN();
        expect(getTimestampInSec(invalidTime, 'end')).toBeNaN();
    }); // Non-integer numeric input

    it('should correctly floor non-integer numeric time', () => {
        const time = fixedDate - 1.5 * 24 * 60 * 60 * 1000; // 1.5 days ago
        const expected = Math.floor(time / 1000);
        expect(getTimestampInSec(time, 'start')).toBe(expected);
    }); // Large number input

    it('should handle large number inputs', () => {
        const time = 9999999999999; // Future timestamp
        const expected = Math.floor(time / 1000);
        expect(getTimestampInSec(time, 'end')).toBe(expected);
    }); // Zero time input

    it('should handle zero as a valid timestamp', () => {
        expect(getTimestampInSec(0, 'start')).toBe(0);
        expect(getTimestampInSec(0, 'end')).toBe(0);
    }); // Negative time input

    it('should handle negative timestamps', () => {
        const negativeTime = -1000;
        expect(getTimestampInSec(negativeTime, 'start')).toBe(
            Math.floor(negativeTime / 1000),
        );
        expect(getTimestampInSec(negativeTime, 'end')).toBe(
            Math.floor(negativeTime / 1000),
        );
    }); // 'type' not provided but time is provided

    it('should correctly process when type is default but time is provided', () => {
        const time = fixedDate - 25 * 24 * 60 * 60 * 1000; // 25 days ago
        const expected = Math.floor(time / 1000);
        expect(getTimestampInSec(time)).toBe(expected);
    });
});
