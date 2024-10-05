import { API_URL } from '.';

export default async function fetchRealtimeETHUSDT() {
    try {
        const resp = await fetch(`${API_URL}/realtime-eth-usdt`).then((res) =>
            res.json(),
        );
        const price: number = resp.data;

        return price;
    } catch (err) {
        throw new Error(`Failed to fetch realtime ETH/USDT price\n${err}`);
    }
}
