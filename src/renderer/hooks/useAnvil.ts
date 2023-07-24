import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { anvilClient } from 'renderer/client';
import { Block, Address, Transaction, Hash } from 'viem';

const useAnvil = () => {
  const [accounts, setAccounts] = useState<Address[]>([]);
  const [blockNumber, setBlockNumber] = useState(0);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [unwatch, setUnwatch] = useState<(() => void) | null>(null);

  const resetStateAndUnwatch = () => {
    if (unwatch) {
      unwatch();
      console.log('⚠️⚠️⚠️ UNWATCH is called inside useAnvil.ts');
    }
    setAccounts([]);
    setBlockNumber(0);
    setBlocks([]);
    setTransactions([]);
  };

  async function getAddresses() {
    try {
      const localAccounts = await anvilClient.getAddresses();
      console.log(
        '⚠️⚠️⚠️ getAddresses is called inside useAnvil.ts',
        localAccounts
      );
      setAccounts(localAccounts);
    } catch (error: any) {
      toast.error(error?.shortMessage);
    }
  }

  useEffect(() => {
    const unwatchFunction = anvilClient.watchBlocks({
      onBlock: async (block) => {
        setBlockNumber(Number(block.number));
        setBlocks((prevBlocks) => [...prevBlocks, block]);
        console.log('⚠️ watchBlocks is called inside useAnvil.ts');

        const blockTransactions = await Promise.all(
          block.transactions.map((txHash) =>
            anvilClient.getTransaction({ hash: txHash as Hash })
          )
        );
        console.log('⚠️ getTransaction is called inside useAnvil.ts');

        setTransactions((prev) => [...prev, ...blockTransactions]);
      },
      onError: (error) => toast.error(error.message),
    });

    setUnwatch(() => unwatchFunction);

    getAddresses();
    console.log('⚠️⚠️⚠️ a new watchBlocks is created in useAnvil.ts ⚠️⚠️⚠️');

    return resetStateAndUnwatch;
  }, []);

  return {
    accounts,
    blockNumber,
    blocks,
    transactions,
    resetStateAndUnwatch,
  };
};

export default useAnvil;
