import fetchUSDTRateAtTimestamp from './fetch-usdt-rate';
import '../env-config';

export const USDC_ETH_POOL_ADDRESS =
    '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640';
export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// Transaction Fee = gasUsed * gasPrice

export async function calcFeeInUSDT(txn: TxnAPI) {
    const { gasPrice, gasUsed } = txn;
    const timestamp = Number(txn.timeStamp);
    const gasPriceInETH = parseInt(gasPrice, 10) / 1e18;
    const gasUsedInETH = parseInt(gasUsed, 10) / 1e18;
    const feeInETH = gasPriceInETH * gasUsedInETH * 1e18;

    const eth_to_usdt_rate = await fetchUSDTRateAtTimestamp(timestamp);
    const feeInUSDT = feeInETH * eth_to_usdt_rate;

    return { feeInUSDT, eth_to_usdt_rate, feeInETH };
}
