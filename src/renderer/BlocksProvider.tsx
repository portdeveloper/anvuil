import { useEffect, useMemo, useState } from 'react';
import { BlocksContext } from './BlocksContext';
import { anvilClient } from './client';
import { Block } from 'viem';

export const BlocksProvider = ({ children }: { children: React.ReactNode }) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);

  const [anvilStatus, setAnvilStatus] = useState(false); // false means Anvil is not running

  const toggleAnvilStatus = () => {
    setAnvilStatus((prevStatus) => !prevStatus);
  };

  const resetBlocksContext = () => {
    setBlocks([]);
    setBlockNumber(0);
    setTransactions([]);
    console.log('->>RESETTING BlocksContext');
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
      onBlock: (block) => {
        setBlockNumber(Number(block.number));
        setBlocks((prev) => [...prev, block]);
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
