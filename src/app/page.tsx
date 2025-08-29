import type { NextPage } from 'next';
import EmailTable from '@/components/EmailTable';

const Home: NextPage = () => {
  return (
    <main className='flex flex-col gap-10 p-5'>
      <h1 className='text-2xl font-bold'>Conecta Senior Frontend Challenge</h1>
      <section className='flex flex-col gap-3'>
        <h2 className='text-xl font-semibold'>Caixa de entrada</h2>
        <EmailTable />
      </section>
    </main>
  );
};

export default Home;

