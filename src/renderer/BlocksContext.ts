import { createContext } from 'react';
import { Block } from 'viem';

type BlocksContextType = {
  blocks: Block[];
  blockNumber: number;
  transactions: any[]; // @todo type
  reset: () => void;
  toggleAnvilStatus: () => void;
};

export const BlocksContext = createContext<BlocksContextType>({
  blocks: [],
  blockNumber: 0,
  transactions: [],
  reset: () => {},
  toggleAnvilStatus: () => {},
});
