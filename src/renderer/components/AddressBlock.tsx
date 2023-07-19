import { useEffect, useState } from 'react';
import { formatEther, parseEther, Address } from 'viem';
import { anvilClient } from 'renderer/client';
import useAnvil from '../hooks/useAnvil';

export const AddressBlock = ({ address }: { address: Address }) => {
  const [nonce, setNonce] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>('');
  const [inputEther, setInputEther] = useState<string>('');
  const [inputNonce, setInputNonce] = useState<string>('');

  const { blockNumber } = useAnvil();

  useEffect(() => {
    const fetchNonce = async () => {
      try {
        const count = await anvilClient.getTransactionCount({ address });

        const accountBalance = await anvilClient.getBalance({
          address,
        });
        setNonce(count);
        setBalance(formatEther(accountBalance));
      } catch (error) {
        console.error('Failed to fetch nonce and balance:', error);
      }
    };

    fetchNonce();
  }, [blockNumber]);

  const handleSetBalance = async () => {
    try {
      await anvilClient.setBalance({
        address,
        value: parseEther(inputEther),
      });

      const accountBalance = await anvilClient.getBalance({
        address,
      });
      setBalance(formatEther(accountBalance));
    } catch (error) {
      console.error('Failed to set balance:', error);
    }
  };

  const handleSetNonce = async () => {
    try {
      await anvilClient.setNonce({
        address,
        nonce: Number(inputNonce),
      });

      const accountNonce = await anvilClient.getTransactionCount({
        address,
      });
      setNonce(accountNonce);
    } catch (error) {
      console.error('Failed to set nonce:', error);
    }
  };

  return (
    <div className="flex justify-between h-20 px-2 py-1 bg-slate-500">
      <div>{address}</div>
      <div>
        <p>Transaction Count: {nonce}</p>
        <div>
          <input
            type="text"
            value={inputNonce}
            onChange={(e) => setInputNonce(e.target.value)}
            placeholder="Enter nonce"
            className="text-black"
          />
          <button type="button" onClick={handleSetNonce}>
            Set Nonce
          </button>
        </div>
      </div>

      <div>
        <p>Ether: {balance.toString()}</p>
        <div>
          <input
            type="text"
            value={inputEther}
            onChange={(e) => setInputEther(e.target.value)}
            placeholder="Enter ether amount"
            className="text-black"
          />
          <button type="button" onClick={handleSetBalance}>
            Set Balance
          </button>
        </div>
      </div>
    </div>
  );
};
