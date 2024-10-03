import express from 'express';
import './env-config';
import fetchRealtimeTxns from './api/fetch-realtime-txn';
import { writeFile } from 'fs/promises';

const app = express();

app.get('/hello', (_, res) => {
    res.send('Hello');
    fetchRealtimeTxns();
});

app.get('/txn', async (req, res) => {
    const [lastBlock, txns] = await fetchRealtimeTxns();
    await writeFile(
        'src/data/txns.json',
        JSON.stringify({ lastBlock, txns }, null, 2)
    );
    res.send('Done');
});

export default app;
