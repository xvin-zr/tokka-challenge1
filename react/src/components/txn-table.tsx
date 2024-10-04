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
import { getTimestampInSec } from '@/utils/get-timestamp-in-sec';
import { useQuery } from '@tanstack/react-query';
import Pagination from './pagination';

type TxnTableProps = {
  hash: string | undefined;
};
export default function TxnTable({ hash }: TxnTableProps) {
  const params = useSearchParams();
  const start = getTimestampInSec(params.get('start'));
  const end = getTimestampInSec(params.get('end'), 'end');
  const page = parseInt(params.get('page') ?? '1');
  const pageSize = parseInt(params.get('pageSize') ?? '50');

  const { data, isPending } = useQuery({
    queryKey: ['txns', start, end, page, pageSize, hash],
    queryFn: () => fetchTxns(start, end, page, pageSize, hash),
  });

  if (isPending) {
    return (
      <>
        <h2 className="text-xl font-bold">Transactions</h2>
        <div>Loading...</div>
      </>
    );
  }

  if (!data || data.txns.length === 0) {
    return (
      <>
        <h2 className="text-xl font-bold">Transactions</h2>
        <div>No transactions found</div>
      </>
    );
  }

  return (
    <>
      <div className="flex w-full">
        <h2 className="text-xl font-bold">Transactions</h2>
        <Pagination page={data.page} totalPages={data.totalPages} />
      </div>
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
