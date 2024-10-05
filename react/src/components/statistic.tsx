import fetchRealtimeETHUSDT from '@/api/fetch-realtime-eth-usdt';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

type StatisticProps = {
  totalETH: number;
  totalUSDT: number;
};
function Statistic({ totalETH, totalUSDT }: StatisticProps) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['statistic'],
    queryFn: fetchRealtimeETHUSDT,
    staleTime: 100,
  });
  const price = query.data;

  useEffect(() => {
    let nextTimeToTick = Date.now();
    function nextAnimationFrame() {
      const now = Date.now();

      if (nextTimeToTick <= now) {
        queryClient.invalidateQueries({ queryKey: ['statistic'] });
        nextTimeToTick = now + 5 * 1000;
      }

      requestAnimationFrame(nextAnimationFrame);
    }

    const reqId = requestAnimationFrame(nextAnimationFrame);

    return () => {
      cancelAnimationFrame(reqId);
    };
  }, [queryClient]);

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
