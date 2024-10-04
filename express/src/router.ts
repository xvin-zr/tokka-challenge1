import { Router } from 'express';
import { param, query } from 'express-validator';
import { validateInputErrors } from './middleware';
import fetchBatchTxns from './api/fetch-batch-txns';
import db from './db';

const router = Router();

const DEFAULT_LIMIT = 50;
const ONE_MONTH_SECONDS = 30 * 24 * 60 * 60; // Approximate seconds in a month

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

            res.status(200).json({
                data: transactions,
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
