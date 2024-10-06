import fetchRealtimeETHUSDT from '@/api/fetch-realtime-eth-usdt';
import { useQuery } from '@tanstack/react-query';

type StatisticProps = {
  totalETH: number;
  totalUSDT: number;
};
function Statistic({ totalETH, totalUSDT }: StatisticProps) {
  const query = useQuery({
    queryKey: ['statistic'],
    queryFn: fetchRealtimeETHUSDT,
    staleTime: 4000,
    refetchInterval: 5000, // this can be improved with web socket
  });
  const price = query.data;

  return (
    <dl className="space-y-4 px-1 pt-2 text-zinc-600">
      <div className="flex justify-between">
        <dt>Total USDT Fee</dt>
        <dd>{totalUSDT.toFixed(2)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>Total ETH Fee</dt>
        <dd>{totalETH.toFixed(4)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>Realtime ETH/USDT</dt>
        <dd>{price ?? 'N/A'}</dd>
      </div>
    </dl>
  );
}

export default Statistic;
