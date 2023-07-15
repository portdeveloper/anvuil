import { useContext } from 'react';
import { BlocksContext } from '../BlocksContext';

export const Transactions = () => {
  const { transactions } = useContext(BlocksContext);

  return (
    <div className="flex flex-col items-center p-5 bg-gray-900 text-white overflow-hidden h-full">
      <h1>transactions</h1>
      <div className="overflow-auto flex flex-col gap-4 w-full h-0 flex-grow">
        {transactions.map((tx) => (
          <div className="flex flex-col bg-slate-500 p-4">
            <p>tx hash: {tx.hash}</p>
            <p>tx from: {tx.from}</p>
            <p>tx to: {tx.to}</p>
            <p>tx value: {tx.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
