import { ETHERSCAN_API_KEY, USDC_ETH_POOL_ADDRESS } from '.';

let lastBlock = 0;
export default async function fetchRealtimeTxns() {
    const out: Txn[] = [];
    try {
        const latestBlockResp = await fetch(
            `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${ETHERSCAN_API_KEY}`
        ).then((res) => res.json());
        const latestBlock = parseInt(latestBlockResp.result, 16);

        const transactionResp =
            await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${USDC_ETH_POOL_ADDRESS}&startblock=${lastBlock}&endblock=${latestBlock}&page=1&offset=50&sort=desc&apikey=${ETHERSCAN_API_KEY}
`).then((res) => res.json());
        const transactions: Txn[] = transactionResp.result;
        console.log(transactions[0]);
        out.push(...transactions);
        return [latestBlock, out] as const;
    } catch (err) {
        throw new Error(`Error fetching transaction: ${err}`);
    }
}
