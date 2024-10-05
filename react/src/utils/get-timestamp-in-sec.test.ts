// tests/getTimestampInSec.test.ts
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { getTimestampInSec } from './get-timestamp-in-sec';

describe('getTimestampInSec', () => {
    const fixedDate = new Date('2023-01-01T00:00:00Z').getTime(); // 固定的日期

    beforeAll(() => {
        // Mock Date.now()，使其返回固定的时间
        vi.spyOn(Date, 'now').mockImplementation(() => fixedDate);
    });

    afterAll(() => {
        // 恢复 Date.now() 的原始实现
        vi.restoreAllMocks();
    });

    // 示例时间戳
    const fixedDateSec = Math.floor(fixedDate / 1000); // 1672531200

    it('should return timestamp for 30 days ago when type is "start" and time is undefined', () => {
        expect(getTimestampInSec(undefined, 'start')).toBe(
            Math.floor((fixedDate - 30 * 24 * 60 * 60 * 1000) / 1000),
        );
    });

    it('should return timestamp for 30 days ago when type is "start" and time is null', () => {
        expect(getTimestampInSec(null, 'start')).toBe(
            Math.floor((fixedDate - 30 * 24 * 60 * 60 * 1000) / 1000),
        );
    });

    it('should return current timestamp plus one day in seconds when type is "end" and time is undefined', () => {
        const expected = fixedDateSec + 86400; // current + 1 day
        expect(getTimestampInSec(undefined, 'end')).toBe(expected);
    });

    it('should return provided time plus one day in seconds when type is "end" and time is provided as number', () => {
        const providedTime = fixedDate - 10 * 24 * 60 * 60 * 1000; // 10 days ago
        const expected = Math.floor(providedTime / 1000) + 86400;
        expect(getTimestampInSec(providedTime, 'end')).toBe(expected);
    });

    it('should return provided time parsed from string plus one day in seconds when type is "end"', () => {
        const providedTimeStr = (
            fixedDate -
            5 * 24 * 60 * 60 * 1000
        ).toString(); // 5 days ago as string
        const expected =
            Math.floor(parseInt(providedTimeStr, 10) / 1000) + 86400;
        expect(getTimestampInSec(providedTimeStr, 'end')).toBe(expected);
    });

    it('should handle invalid string input by using current time and adding one day when type is "end"', () => {
        const invalidTimeStr = 'invalid';
        const expected = fixedDateSec + 86400; // fallback to current time + 1 day
        expect(getTimestampInSec(invalidTimeStr, 'end')).toBe(expected);
    });

    it('should return current timestamp in seconds when type is "start" and time is invalid string', () => {
        const invalidTimeStr = 'invalid';
        const expected = Math.floor(Date.now() / 1000);
        expect(getTimestampInSec(invalidTimeStr, 'start')).toBe(expected);
    });

    it('should return zero when time is 0 and type is "end"', () => {
        // Special case: time = 0 (epoch)
        const expected = 0 + 86400;
        expect(getTimestampInSec(0, 'end')).toBe(expected);
    });

    it('should handle negative timestamps correctly when type is "start"', () => {
        const negativeTime = -1000; // 1000 ms before epoch
        const expected = Math.floor(negativeTime / 1000);
        expect(getTimestampInSec(negativeTime, 'start')).toBe(expected);
    });

    it('should add one day to the final timestamp when type is "end" regardless of time type', () => {
        // Test with number
        const timeNumber = fixedDate + 2 * 24 * 60 * 60 * 1000; // current + 2 days
        const expectedNumber = Math.floor(timeNumber / 1000) + 86400;
        expect(getTimestampInSec(timeNumber, 'end')).toBe(expectedNumber);

        // Test with string
        const timeString = (fixedDate + 3 * 24 * 60 * 60 * 1000).toString(); // current + 3 days as string
        const expectedString =
            Math.floor(parseInt(timeString, 10) / 1000) + 86400;
        expect(getTimestampInSec(timeString, 'end')).toBe(expectedString);
    });
});
