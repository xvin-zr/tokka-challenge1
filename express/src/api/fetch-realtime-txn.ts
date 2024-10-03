import { ETHERSCAN_API_KEY, USDC_ETH_POOL_ADDRESS } from '.';
import { lastBlock, txns } from '../data/txns.json';

export default async function fetchRealtimeTxns() {
    try {
        const latestBlockResp = await fetch(
            `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${ETHERSCAN_API_KEY}`
        ).then((res) => res.json());
        const latestBlock = parseInt(latestBlockResp.result, 16);

        const transactionResp = await fetch(
            `https://api.etherscan.io/api?module=account&action=tokentx&address=${USDC_ETH_POOL_ADDRESS}&page=1&offset=100&startblock=${
                lastBlock ? lastBlock : latestBlock - 99
            }&endblock=${latestBlock}&sort=desc&apikey=${ETHERSCAN_API_KEY}`
        ).then((res) => res.json());
        const transactions: Txn[] = transactionResp.result;
        console.log(transactions[0]);
        txns.push(...transactions);
        return [latestBlock, txns] as const;
    } catch (err) {
        throw new Error(`Error fetching transaction: ${err}`);
    }
}
