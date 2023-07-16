import { useEffect, useMemo, useState } from 'react';
import { BlocksContext } from './BlocksContext';
import { anvilClient } from './client';
import { Block, Transaction, Log } from 'viem';

export const BlocksProvider = ({ children }: { children: React.ReactNode }) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mempool, setMempool] = useState({ pending: {}, queued: {} }); // @todo type
  const [logs, setLogs] = useState<Log[]>([]);

  const [anvilStatus, setAnvilStatus] = useState(false); // false means Anvil is not running

  const toggleAnvilStatus = () => {
    setAnvilStatus((prevStatus) => !prevStatus);
  };

  const resetBlocksContext = () => {
    setBlocks([]);
    setBlockNumber(0);
    setTransactions([]);
    setMempool({ pending: {}, queued: {} });
    setLogs([]);
  };

  const value = useMemo(
    () => ({
      blocks,
      blockNumber,
      transactions,
      mempool,
      logs,
      anvilStatus,
      reset: resetBlocksContext,
      toggleAnvilStatus,
    }),
    [blocks, blockNumber, transactions, mempool, logs, anvilStatus]
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

  useEffect(() => {
    const fetchMempool = async () => {
      try {
        const memorypool = await anvilClient.getTxpoolContent();
        console.log('memorypool: ', memorypool);
        setMempool(memorypool);
      } catch (error) {
        console.error('Failed to fetch mempool: ', error);
      }
    };

    fetchMempool(); // Fetch once immediately
    const intervalId = setInterval(fetchMempool, 10000); // Then fetch every 10 seconds
    // Cleanup: clear the interval when the component unmounts or anvilStatus changes
    return () => clearInterval(intervalId);
  }, [anvilStatus]);

  useEffect(() => {
    const unwatch = anvilClient.watchEvent({
      onLogs: (logs) => setLogs((prev) => [...prev, ...logs]),
    });
    console.log('watching event');
    return () => {
      unwatch();
    };
  }, [anvilStatus]);

  return (
    <BlocksContext.Provider value={value}>{children}</BlocksContext.Provider>
  );
};
