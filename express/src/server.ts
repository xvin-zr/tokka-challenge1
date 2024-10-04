import express from 'express';
import fetchRealtimeTxns from './api/fetch-realtime-txn';
import './env-config';
import router from './router';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', router);

app.get('/hello', (_, res) => {
    res.send('Hello');
    fetchRealtimeTxns();
});

export default app;
