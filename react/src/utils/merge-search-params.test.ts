import { describe, it, expect } from 'vitest';
import { mergeSearchParams } from './merge-search-params';

describe('mergeSearchParams', () => {
    it('merges search params', () => {
        const first = 'a=1&b=2';
        const second = 'b=3&c=4';

        expect(mergeSearchParams(first, second)).toBe('a=1&b=3&c=4');
    });

    it('merges search params with no overlap', () => {
        const first = 'a=1&b=2';
        const second = 'c=3';

        expect(mergeSearchParams(first, second)).toBe('a=1&b=2&c=3');
    });
});
