import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import Form from './components/form';
import TxnTable from './components/txn-table';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="grid min-h-screen gap-6 bg-zinc-50 p-4 lg:grid-cols-4">
        <section className="">
          <Form></Form>
        </section>
        <section className="lg:col-span-3">
          <TxnTable />
        </section>
      </main>
    </QueryClientProvider>
  );
}

export default App;
