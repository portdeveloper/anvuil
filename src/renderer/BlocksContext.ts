import { createContext } from 'react';
import { Block, Transaction } from 'viem';

type BlocksContextType = {
  blocks: Block[];
  blockNumber: number;
  transactions: Transaction[];
  mempool: any; // @todo type
  reset: () => void;
  toggleAnvilStatus: () => void;
};

export const BlocksContext = createContext<BlocksContextType>({
  blocks: [],
  blockNumber: 0,
  transactions: [],
  mempool: {},
  reset: () => {},
  toggleAnvilStatus: () => {},
});
