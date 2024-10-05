import { Router } from 'express';
import { param, query } from 'express-validator';
import fetchBatchTxns from './api/fetch-batch-txns';
import { BINANCE_API_URL } from './api/fetch-usdt-rate';
import db from './db';
import { validateInputErrors } from './middleware';

const router = Router();

const DEFAULT_LIMIT = 50;
const ONE_MONTH_SECONDS = 30 * 24 * 60 * 60; // Approximate seconds in a month

/**
 * Endpoint: GET /history-txns
 * Description: Retrieves a list of transactions within a specified time range.
 * 
 * Query Parameters:
 * - start (optional): Starting timestamp (Unix timestamp in seconds)
 * - end (optional): Ending timestamp (Unix timestamp in seconds)
 * - page (optional): Page number for pagination (default: 1)
 * - pageSize (optional): Number of items per page (default: 10, min: 10)
 * 
 * Response:
 * {
 *   data: [{ transaction details }],
 *   totalUSDT: number,
 *   totalETH: number,
 *   pagination: {
 *     page: number,
 *     pageSize: number,
 *     total: number,
 *     totalPages: number
 *   }
 * }
 */
router.get(
    '/history-txns',
    query('start').optional().isInt({ min: 0 }),
    query('end').optional().isInt({ min: 0 }),
    query('page').optional().isInt({ min: 1 }),
    query('pageSize').optional().isInt({ min: 10 }),
    validateInputErrors,
    async function getHistoryTxns(req, res) {
        try {
            const { start, end } = req.query;
            const page: number = req.query.page
                ? parseInt(req.query.page as string, 10)
                : 1;
            const limit = Number(req.query.pageSize) || DEFAULT_LIMIT;
            const offset = (page - 1) * limit;

            let startTime: number;
            let endTimeTs: number;

            if (start && end) {
                startTime = parseInt(start as string, 10);
                endTimeTs = parseInt(end as string, 10);

                if (startTime > endTimeTs) {
                    res.status(400).json({
                        error: "'start' timestamp must be less than 'end' timestamp.",
                    });
                    return;
                }
            } else if (!start && !end) {
                // Default to last month
                endTimeTs = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
                startTime = endTimeTs - ONE_MONTH_SECONDS;
            } else if (start && !end) {
                // If only start is provided, set end to current time
                startTime = parseInt(start as string, 10);
                endTimeTs = Math.floor(Date.now() / 1000);
            } else {
                // If only end is provided, set start to one month before end
                endTimeTs = parseInt(end as string, 10);
                startTime = endTimeTs - ONE_MONTH_SECONDS;
            }

            // Prepare SQL query
            const sql = `SELECT * FROM transactions WHERE timeStamp BETWEEN ? AND ? ORDER BY timeStamp DESC LIMIT ? OFFSET ?`;
            const params = [startTime, endTimeTs, limit, offset];

            // Get total count for pagination
            const countStmt = db.prepare(
                `SELECT COUNT(*) as count FROM transactions WHERE timeStamp BETWEEN ? AND ?`,
            );
            const count = countStmt.get(startTime, endTimeTs) as {
                count: number;
            };
            const total = count.count;

            // Execute the main query
            const stmt = db.prepare(sql);
            const transactions = stmt.all(...params) as Txn[];

            // Calculate total fees in USDT and ETH
            const feeStmt = db.prepare(
                `SELECT SUM(feeInUSDT) as totalUSDTFee, SUM(feeInETH) as totalETHFee FROM transactions WHERE timeStamp BETWEEN ? AND ?`
            );
            const fees = feeStmt.get(startTime, endTimeTs) as {
                totalUSDTFee: number | null;
                totalETHFee: number | null;
            };
            const totalUSDTFee = fees.totalUSDTFee ?? 0;
            const totalETHFee = fees.totalETHFee ?? 0;

            res.status(200).json({
                data: transactions,
                totalUSDT: totalUSDTFee,
                totalETH: totalETHFee,
                pagination: {
                    page,
                    pageSize: limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
            return;
        } catch (err) {
            console.error(`Error in /history-txns: ${err}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
);

/**
 * Endpoint: GET /history-txns/:hash
 * Description: Retrieves a specific transaction by its hash.
 * 
 * Path Parameters:
 * - hash: Transaction hash (hexadecimal)
 * 
 * Response:
 * {
 *   data: [{ transaction details }],
 *   totalETH: number,
 *   totalUSDT: number,
 *   pagination: {
 *     page: 1,
 *     pageSize: 1,
 *     total: 1,
 *     totalPages: 1
 *   }
 * }
 */
router.get(
    '/history-txns/:hash',
    param('hash').isHexadecimal().notEmpty(),
    validateInputErrors,
    async function getHistoryTxn(req, res) {
        try {
            const { hash } = req.params;

            // fetch the transaction with that hash
            const sql = `SELECT * FROM transactions WHERE hash = ?`;
            const params = [hash];

            // Execute the main query
            const stmt = db.prepare(sql);
            const transactions = stmt.get(...params) as Txn;

            if (!transactions) {
                res.status(404).json({ error: 'Transaction not found' });
                return;
            }

            // Structure the response
            res.status(200).json({
                data: [transactions],
                totalETH: transactions.feeInETH,
                totalUSDT: transactions.feeInUSDT,
                pagination: {
                    page: 1,
                    pageSize: 1,
                    total: 1,
                    totalPages: 1,
                },
            });
        } catch (err) {
            console.error(`Error in /history-txns/:hash: ${err}`);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
    },
);

/**
 * Endpoint: GET /realtime-eth-usdt
 * Description: Retrieves the current ETH/USDT price.
 * 
 * Response:
 * {
 *   data: number // Current ETH/USDT price
 * }
 */
router.get('/realtime-eth-usdt', async function (_, res) {
    try {
        const resp = await fetch(`${BINANCE_API_URL}?symbol=ETHUSDT&interval=1m&limit=1`).then(res => res.json());

        if (!resp || resp.length === 0) {
            throw new Error('No price data available for the given timestamp.');
        }

        const price = parseFloat(resp[0][4]); // Close price of the candle

        res.json({data: price})
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
        throw new Error(`Error fetching ETH price: ${err}`);
    }
})

/**
 * Endpoint: GET /batch-txns
 * Description: Retrieves a batch of transactions within a specified time range.
 * 
 * Query Parameters:
 * - start (required): Starting timestamp (Unix timestamp in seconds)
 * - end (required): Ending timestamp (Unix timestamp in seconds)
 * - page (optional): Page number for pagination (default: 1)
 * 
 * Response:
 * {
 *   txns: [{ transaction details }]
 * }
 */
router.get(
    '/batch-txns',
    query('start').isInt().notEmpty(),
    query('end').isInt().notEmpty(),
    query('page').isInt(),
    validateInputErrors,
    async function batchTxns(req, res) {
        const { start, end } = req.query as { start: string; end: string };
        const page = parseInt((req.query.page as string) || '1', 10);

        try {
            const txns = await fetchBatchTxns(
                parseInt(start),
                parseInt(end),
                page,
            );

            res.json({ txns });
        } catch (err) {
            res.status(500).json({ error: 'server error' });
        }
    },
);

export default router;
