import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function TxnTable() {
  return (
    <>
      <h2 className="text-xl font-bold">Transactions</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="max-w-40">Hash</TableHead>
            <TableHead>Block Number</TableHead>
            <TableHead>ETH</TableHead>
            <TableHead>USDT</TableHead>
            <TableHead>ETH/USDT</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="max-w-40 truncate font-medium">
              0x6ebb2e06f61f79483e590634abd100382aac9f7f11ea342ed5835322c414c76a
            </TableCell>
            <TableCell>20890693</TableCell>
            <TableCell>2.76</TableCell>
            <TableCell>0.001161</TableCell>
            <TableCell>2382.62</TableCell>

            <TableCell className="text-right">
              {new Date(1728027251).toLocaleDateString()}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
