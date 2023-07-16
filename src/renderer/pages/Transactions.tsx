import { useContext } from 'react';
import { BlocksContext } from '../BlocksContext';

export const Transactions = () => {
  const { transactions } = useContext(BlocksContext);

  return transactions.length === 0 ? (
    <div className="h-full flex items-center justify-center p-5 bg-gray-900 text-white">
      No transactions yet, please start anvil
    </div>
  ) : (
    <div className="flex flex-col items-center p-5 bg-gray-900 text-white overflow-hidden h-full">
      <div className="overflow-auto flex flex-col gap-4 w-full h-0 flex-grow">
        {transactions.map((tx) => (
          <div key={tx.hash} className="flex flex-col bg-slate-500 p-4">
            <p>tx hash: {tx.hash}</p>
            <p>tx from: {tx.from}</p>
            <p>tx to: {tx.to}</p>
            <p>tx value: {Number(tx.value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
