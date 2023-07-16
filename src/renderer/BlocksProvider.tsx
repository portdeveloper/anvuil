import { useEffect, useMemo, useState } from 'react';
import { BlocksContext } from './BlocksContext';
import { anvilClient } from './client';
import { Block, Transaction } from 'viem';

export const BlocksProvider = ({ children }: { children: React.ReactNode }) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]); // @todo type

  const [anvilStatus, setAnvilStatus] = useState(false); // false means Anvil is not running

  const toggleAnvilStatus = () => {
    setAnvilStatus((prevStatus) => !prevStatus);
  };

  const resetBlocksContext = () => {
    setBlocks([]);
    setBlockNumber(0);
    setTransactions([]);
  };

  const value = useMemo(
    () => ({
      blocks,
      blockNumber,
      transactions,
      reset: resetBlocksContext,
      toggleAnvilStatus,
    }),
    [blocks, blockNumber, transactions]
  );

  useEffect(() => {
    const unwatch = anvilClient.watchBlocks({
      onBlock: async (block) => {
        setBlockNumber(Number(block.number));
        setBlocks((prev) => [...prev, block]);

        try {
          const fetchedTransactions = await Promise.all(
            block.transactions.map((tx) =>
              anvilClient.getTransaction({ hash: tx as Transaction['hash'] })
            )
          );
          console.log("TRYING TO GET TXs");
          setTransactions((prev) => [...prev, ...fetchedTransactions]);
        } catch (error) {
          console.error('Failed to fetch transactions: ', error);
        }
      },
      onError: (error) => console.log(error),
    });

    return () => {
      unwatch();
    };
  }, [anvilStatus]);

  return (
    <BlocksContext.Provider value={value}>{children}</BlocksContext.Provider>
  );
};
