import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import './App.css';
import Form from './components/form';
import Statistic from './components/statistic';
import TxnTable from './components/txn-table';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
  const [hash, setHash] = useState<string | undefined>(undefined);
  const [totalETH, setTotalETH] = useState<number>(0);
  const [totalUSDT, setTotalUSDT] = useState<number>(0);

  return (
    <QueryClientProvider client={queryClient}>
      <main className="grid min-h-screen gap-6 bg-zinc-50 p-4 lg:grid-cols-4">
        <section className="space-y-4 divide-y">
          <Form setHash={setHash}></Form>
          <Statistic totalETH={totalETH} totalUSDT={totalUSDT} />
        </section>
        <section className="lg:col-span-3">
          <TxnTable
            hash={hash}
            setTotalETH={setTotalETH}
            setTotalUSDT={setTotalUSDT}
          />
        </section>
      </main>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
