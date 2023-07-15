import { useEffect, useState } from 'react';
import { anvilClient } from 'renderer/client';
import { Hash } from 'viem';

export const Transactions = () => {
  const [hashes, setHashes] = useState<Hash[]>([]);
  const [txReceipts, setTxReceipts] = useState<any[]>([]); // @todo type

  useEffect(() => {
    const unwatch = anvilClient.watchPendingTransactions({
      onTransactions: (hashes) => {
        setHashes(hashes);
      },
    });

    return () => {
      unwatch();
    };
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      const fetchedTransactions = await Promise.all(
        hashes.map((tx) => anvilClient.getTransaction({ hash: tx }))
      );

      setTxReceipts((prev) => [...prev, ...fetchedTransactions]);
    };
    if (hashes.length) {
      fetchTransactions();
    }
  }, [hashes]);

  return (
    <div className="flex flex-col items-center p-5 bg-gray-900 text-white overflow-hidden h-full">
      <h1>transactions</h1>
      <div className="overflow-auto flex flex-col gap-4 w-full h-0 flex-grow">
        {txReceipts.map((tx) => (
          <div>
            <p>{tx.hash}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
