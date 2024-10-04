import { calcFeeInUSDT, ETHERSCAN_API_KEY, USDC_ETH_POOL_ADDRESS } from '.';
import db from '../db';
import fetchUSDTRateAtTimestamp from './fetch-usdt-rate';

fetchRealtimeTxns();
setInterval(fetchRealtimeTxns, 10 * 60 * 1000);

/**
 * Fetches real-time transactions from an API and stores them in a database.
 */
export default async function fetchRealtimeTxns() {
    // Initialize variables
    let currentPage = 1;
    const offset = 100; // Number of transactions per page
    const txns: Txn[] = [];

    try {
        // Fetch the latest block number from the API
        const latestBlockResp = await fetch(
            `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${ETHERSCAN_API_KEY}`
        ).then((res) => res.json());
        const latestBlock = parseInt(latestBlockResp.result, 16) || 3000_0000;
        console.log({ latestBlock });

        // Retrieve the last block number from the database
        const lastBlock =
            Number(
                db
                    .prepare(
                        'SELECT blockNumber FROM transactions ORDER BY blockNumber DESC LIMIT 1'
                    )
                    .get()
            ) || 20886038;
        console.log({ lastBlock });

        let hasMore = true;
        while (hasMore) {
            // Fetch transactions from the API
            const transactionResp = await fetch(
                `https://api.etherscan.io/api?module=account&action=tokentx&address=${USDC_ETH_POOL_ADDRESS}&page=${currentPage}&offset=${offset}&startblock=${
                    lastBlock ?? latestBlock - 99
                }&endblock=${latestBlock}&sort=desc&apikey=${ETHERSCAN_API_KEY}`
            ).then((res) => res.json());

            // Check if there are no more transactions to fetch
            if (transactionResp.status === '0') {
                console.log('No more transactions to fetch.');
                break;
            }

            const transactions: TxnAPI[] = transactionResp.result;

            console.log(
                `Fetched ${transactions.length} transactions from page ${currentPage}.`
            );

            // Process and store each transaction
            for (const txn of transactions) {
                try {
                    // Calculate fee in USDT and ETH to USDT rate
                    const { feeInUSDT, feeInETH, eth_to_usdt_rate } =
                        await calcFeeInUSDT(txn);
                    const newTxn: Txn = {
                        ...txn,
                        feeInUSDT,
                        feeInETH,
                        eth_to_usdt_rate,
                    };
                    txns.push(newTxn);

                    // Insert the transaction into the database if it doesn't already exist
                    db.prepare(
                        'INSERT OR IGNORE INTO transactions VALUES (@hash, @blockNumber, @timeStamp, @feeInUSDT, @feeInETH, @eth_to_usdt_rate)'
                    ).run(newTxn);
                } catch (err) {
                    throw new Error(`Error calculating fee\n${err}`);
                }
            }

            // Check if there are more transactions to fetch
            if (transactions.length < offset) {
                hasMore = false;
            } else {
                currentPage++;
            }
        }

        return [latestBlock, txns] as const;
    } catch (err) {
        throw new Error(`Error fetching transaction: ${err}`);
    }
}
