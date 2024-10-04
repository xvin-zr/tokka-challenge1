import request from 'supertest';
import app from '../server';

describe('HistoryTxns API Endpoints', async () => {
    beforeAll(() => {
        process.env.NODE_ENV = 'test';
        // In-memory database is already set up via db.ts
    });

    // const [latestBlock, txns] = await fetchRealtimeTxns();

    describe('GET /api/history-txns', () => {
        it('should fetch transactions from the last month when no query parameters are provided', async () => {
            const response = await request(app).get('/api/history-txns');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThanOrEqual(0); // Depending on seeded data

            expect(response.body).toHaveProperty('pagination');
            expect(response.body.pagination).toHaveProperty('page', 1);
            expect(response.body.pagination).toHaveProperty('pageSize', 50);
            expect(response.body.pagination).toHaveProperty('total');
            expect(response.body.pagination).toHaveProperty('totalPages');
        });

        it('should fetch transactions with pagination parameters', async () => {
            // Assuming you have enough seeded transactions, fetch the second page
            const response = await request(app)
                .get('/api/history-txns')
                .query({ page: 1, pageSize: 20 });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data.length).toBe(20); // Page size is 20

            expect(response.body).toHaveProperty('pagination');
            expect(response.body.pagination).toHaveProperty('page', 1);
            expect(response.body.pagination).toHaveProperty('pageSize', 20);
        });

        it('should return an error when start timestamp is greater than end timestamp', async () => {
            const start = 1609459300; // Jan 1, 2021 00:01:40 GMT
            const end = 1609459200; // Jan 1, 2021 00:00:00 GMT

            const response = await request(app)
                .get('/api/history-txns')
                .query({ start, end });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty(
                'error',
                "'start' timestamp must be less than 'end' timestamp.",
            );
        });
    });
});
