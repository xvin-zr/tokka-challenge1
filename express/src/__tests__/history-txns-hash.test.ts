import request from 'supertest';
import app from '../server';

describe('HistoryTxns API Endpoints', async () => {
    describe('GET /api/history-txns/:hash', () => {
        const existingHash =
            '0x6ebb2e06f61f79483e590634abd100382aac9f7f11ea342ed5835322c414c76a';

        it('should fetch a transaction by its hash', async () => {
            const response = await request(app).get(
                `/api/history-txns/${existingHash}`
            );

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');

            const txn = response.body.data;
            expect(txn).toHaveProperty('hash', existingHash);
            expect(txn).toHaveProperty('blockNumber', '20890693');
            expect(txn).toHaveProperty('timeStamp', '1728027251');
            expect(txn).toHaveProperty('feeInUSDT', 2.7663505745040893);
            expect(txn).toHaveProperty('eth_to_usdt_rate', 2382.62);
        });

        it('should return 404 when transaction hash does not exist', async () => {
            const nonExistentHash =
                '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc';

            const response = await request(app).get(
                `/api/history-txns/${nonExistentHash}`
            );

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty(
                'error',
                'Transaction not found'
            );
        });

        it('should return validation errors for invalid hash', async () => {
            const invalidHash = 'invalidhash123';

            const response = await request(app).get(
                `/api/history-txns/${invalidHash}`
            );

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
            expect(Array.isArray(response.body.errors)).toBe(true);
            expect(response.body.errors.length).toBeGreaterThan(0);
        });
    });
});
