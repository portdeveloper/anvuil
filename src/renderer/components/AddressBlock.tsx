import { useEffect, useState } from 'react';
import { formatEther, Address } from 'viem';
import { anvilClient } from 'renderer/client';

export const AddressBlock = ({ address }: { address: Address }) => {
  const [txCount, setTxCount] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>('');

  useEffect(() => {
    const fetchTxCount = async () => {
      const count = await anvilClient.getTransactionCount({ address });

      const accountBalance = await anvilClient.getBalance({
        address,
      });

      setTxCount(count);
      setBalance(formatEther(accountBalance));
    };

    fetchTxCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-between px-4 py-2 bg-slate-500">
      <div>{address}</div>
      <p>Transaction Count: {txCount}</p>
      <p>Ether: {balance.toString()}</p>
    </div>
  );
};

export default AddressBlock;
