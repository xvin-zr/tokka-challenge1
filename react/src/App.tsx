import './App.css';
import Form from './components/form';
import TxnTable from './components/txn-table';

function App() {
  return (
    <main className="grid min-h-screen grid-cols-4 gap-6 bg-zinc-50 p-4">
      <section className="">
        <Form></Form>
      </section>
      <section className="col-span-3">
        <TxnTable />
      </section>
    </main>
  );
}

export default App;
