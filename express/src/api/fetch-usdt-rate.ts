const BINANCE_API_URL = 'https://api.binance.com/api/v3/klines';

// In-memory cache to store ETH prices to minimize API calls
const usdtRateCache = new Map<number, number>();

/**
 * Fetches the ETH price in USDT at a specific timestamp.
 */
export default async function fetchUSDTRateAtTimestamp(timestamp: number) {
    // Calculate the start of the minute
    const startOfMinute = timestamp - (timestamp % 60);
    // Check if the price for this minute is already cached
    if (usdtRateCache.has(startOfMinute)) {
        return usdtRateCache.get(startOfMinute)!;
    }

    // Convert to milliseconds for Binance API
    const startTimeMs = startOfMinute * 1000;
    const endTimeMs = (startOfMinute + 60) * 1000;

    try {
        const resp = await fetch(
            `${BINANCE_API_URL}?symbol=ETHUSDT&interval=1m&startTime=${startTimeMs}&endTime=${endTimeMs}&limit=1`
        ).then((res) => res.json());

        if (!resp || resp.length === 0) {
            throw new Error('No price data available for the given timestamp.');
        }

        const closePrice = parseFloat(resp[0][4]); // Close price of the candle

        // Cache the fetched price
        usdtRateCache.set(timestamp, closePrice);

        return closePrice;
    } catch (err) {
        throw new Error(
            `Failed to fetch ETH price at timestamp ${timestamp}\n\n${err}`
        );
    }
}
