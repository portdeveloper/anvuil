import { createContext } from 'react';
import { Block, Transaction, Log } from 'viem';

type BlocksContextType = {
  blocks: Block[];
  blockNumber: number;
  transactions: Transaction[];
  mempool: any; // @todo type
  logs: Log[];
  reset: () => void;
  toggleAnvilStatus: () => void;
};

export const BlocksContext = createContext<BlocksContextType>({
  blocks: [],
  blockNumber: 0,
  transactions: [],
  mempool: {},
  logs: [],
  reset: () => {},
  toggleAnvilStatus: () => {},
});
