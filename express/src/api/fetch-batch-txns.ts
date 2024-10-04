import { calcFeeInUSDT, ETHERSCAN_API_KEY } from '.';
import db from '../db';

export default async function fetchBatchTxns(
    start: number,
    end: number,
    page = 1,
) {
    const startBlock = await fetchBlockNumByTimestamp(start, 'after');
    const endBlock = await fetchBlockNumByTimestamp(end, 'before');

    console.log(
        `Fetching transactions from block ${startBlock} to block ${endBlock}.`,
    );

    const pageSize = 100; // Number of transactions per API call
    let hasMore = true;

    const txns: Txn[] = [];

    do {
        const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${process.env.USDC_ETH_POOL_ADDRESS}&page=${page}&offset=${pageSize}&startblock=${startBlock}&endblock=${endBlock}&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`;

        const resp = await fetch(url).then((res) => res.json());
        if (resp.status === '0') {
            console.log('No more transactions to fetch.');
            return [];
        }

        const transactions: TxnAPI[] = resp.result;
        console.log(
            `Fetched ${transactions.length} transactions from page ${page}.`,
        );

        // Process transactions
        for (const txn of transactions) {
            try {
                const { feeInUSDT, feeInETH, eth_to_usdt_rate } =
                    await calcFeeInUSDT(txn);
                const newTxn: Txn = {
                    ...txn,
                    feeInUSDT,
                    feeInETH,
                    eth_to_usdt_rate,
                };
                txns.push(newTxn);
                db.prepare(
                    'INSERT OR IGNORE INTO transactions VALUES (@hash, @blockNumber, @timeStamp, @feeInUSDT,@feeInEth, @eth_to_usdt_rate)',
                ).run(newTxn);
            } catch (error: any) {
                console.error(
                    `Error processing transaction ${txn.hash}: ${error.message}`,
                );
                // Optionally, continue with the next transaction
            }
        }

        if (transactions.length < pageSize) {
            hasMore = false;
        } else {
            page++;
        }
    } while (hasMore);

    return txns;
}

async function fetchBlockNumByTimestamp(
    timestamp: number,
    closest: 'before' | 'after' = 'before',
) {
    const url = `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=${closest}&apikey=${ETHERSCAN_API_KEY}`;

    try {
        const resp = await fetch(url).then((res) => res.json());
        if (resp.status !== '1') {
            throw new Error(`Error fetching block number\n${resp.result}`);
        }

        return resp.result as string;
    } catch (err) {
        throw new Error(`Error fetching block number\n${err}`);
    }
}
