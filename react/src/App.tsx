import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import Form from './components/form';
import TxnTable from './components/txn-table';
import { useState } from 'react';

const queryClient = new QueryClient();

function App() {
  const [hash, setHash] = useState<string | undefined>(undefined);
  return (
    <QueryClientProvider client={queryClient}>
      <main className="grid min-h-screen gap-6 bg-zinc-50 p-4 lg:grid-cols-4">
        <section className="">
          <Form setHash={setHash}></Form>
        </section>
        <section className="lg:col-span-3">
          <TxnTable hash={hash} />
        </section>
      </main>
    </QueryClientProvider>
  );
}

export default App;
