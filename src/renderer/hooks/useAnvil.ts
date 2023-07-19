import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { anvilClient } from 'renderer/client';
import { Block, Address, Transaction, Hash, Log } from 'viem';

const useAnvil = () => {
  const [accounts, setAccounts] = useState<Address[]>([]); // @todo type
  const [blockNumber, setBlockNumber] = useState(0);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]); // @todo type
  const [logs, setLogs] = useState<Log[]>([]);

  async function getAddresses() {
    try {
      const localAccounts = await anvilClient.getAddresses();
      setAccounts(localAccounts);
    } catch (error: any) {
      toast.error(error?.shortMessage);
    }
  }

  useEffect(() => {
    const unwatch = anvilClient.watchBlocks({
      onBlock: async (block) => {
        setBlockNumber(Number(block.number));
        setBlocks((prevBlocks) => [...prevBlocks, block]);

        const blockTransactions = await Promise.all(
          block.transactions.map((txHash) =>
            anvilClient.getTransaction({ hash: txHash as Hash })
          )
        );
        console.log('blockTransactions:', blockTransactions); // log the transactions from the new block

        setTransactions((prev) => [...prev, ...blockTransactions]);
      },
      onError: (error) => toast.error(error.message),
    });

    getAddresses();

    return () => {
      unwatch();
    };
  }, []);

  useEffect(() => {
    const unwatch = anvilClient.watchEvent({
      onLogs: (logs) => setLogs((prev) => [...prev, ...logs]),
      onError: (error) => toast.error(error.message),
    });

    return () => {
      unwatch();
    };
  }, []);

  return { accounts, blockNumber, blocks, transactions, logs };
};

export default useAnvil;
