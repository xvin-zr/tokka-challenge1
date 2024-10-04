import fetchTxns from '@/api/fetch-txns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useSearchParams from '@/hooks/use-search-params';
import { useQuery } from '@tanstack/react-query';

export default function TxnTable() {
  const params = useSearchParams();
  const start =
    parseInt(params.get('start') ?? '0') ||
    (Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000;
  const end = parseInt(params.get('end') ?? '0') || Date.now() / 1000;
  const page = parseInt(params.get('page') ?? '1');
  const pageSize = parseInt(params.get('pageSize') ?? '50');
  const hash = undefined;

  const { data, isPending } = useQuery({
    queryKey: ['txns', start, end, page, pageSize, hash],
    queryFn: () => fetchTxns(start, end, pageSize),
  });

  if (isPending) {
    return (
      <>
        <h2 className="text-xl font-bold">Transactions</h2>
        <div>Loading...</div>;
      </>
    );
  }

  if (!data || data.txns.length === 0) {
    return (
      <>
        <h2 className="text-xl font-bold">Transactions</h2>
        <div>No transactions found</div>;
      </>
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold">Transactions</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="max-w-36">Hash</TableHead>
            <TableHead>Block Number</TableHead>
            <TableHead>ETH</TableHead>
            <TableHead>USDT</TableHead>
            <TableHead>ETH/USDT</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.txns.map((txn) => (
            <TableRow key={txn.hash}>
              <TableCell className="max-w-36 truncate font-medium">
                {txn.hash}
              </TableCell>
              <TableCell>{txn.blockNumber}</TableCell>
              <TableCell>{txn.feeInETH.toFixed(6)}</TableCell>
              <TableCell>{txn.feeInUSDT.toFixed(2)}</TableCell>
              <TableCell>{txn.eth_to_usdt_rate}</TableCell>
              <TableCell className="text-right">
                {new Date(Number(`${txn.timeStamp}000`)).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
