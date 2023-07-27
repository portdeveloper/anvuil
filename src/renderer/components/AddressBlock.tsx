import { useEffect, useState } from 'react';
import { formatEther, parseEther, Address } from 'viem';
import { anvilClient } from 'renderer/client';
import { AddressComp } from './AddressComp';
/**
 * @todo need a way to update this component when the balance or nonce changes
 * setting the nonce is pretty rare, might remove?
 */

export const AddressBlock = ({
  address,
  updateInterval,
}: {
  address: Address;
  updateInterval: number;
}) => {
  const [nonce, setNonce] = useState<string>('');
  const [inputNonce, setInputNonce] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [inputEther, setInputEther] = useState<string>('');

  useEffect(() => {
    const fetchNonceAndBalance = async () => {
      try {
        const count = await anvilClient.getTransactionCount({ address });

        const accountBalance = await anvilClient.getBalance({
          address,
        });
        setNonce(count.toString());
        setBalance(formatEther(accountBalance));
      } catch (error) {
        console.error('Failed to fetch nonce and balance:', error);
      }
    };
    const intervalId = setInterval(fetchNonceAndBalance, updateInterval);

    fetchNonceAndBalance();

    return () => clearInterval(intervalId);
  }, [address, updateInterval]);

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
      setNonce(accountNonce.toString());
    } catch (error) {
      console.error('Failed to set nonce:', error);
    }
  };

  return (
    <tr>
      <td>
        <AddressComp address={address} />
      </td>
      <td>
        <div className="form-control flex flex-row gap-2">
          <input
            type="text"
            value={inputNonce !== '' ? inputNonce : nonce?.toString()}
            onChange={(e) => setInputNonce(e.target.value)}
            placeholder="Enter nonce"
            className="input input-bordered input-xs"
          />
          <button
            type="button"
            className="btn btn-primary btn-xs "
            onClick={handleSetNonce}
          >
            Set Nonce
          </button>
        </div>
      </td>
      <td>
        <div className="form-control flex flex-row gap-2">
          <input
            type="text"
            value={inputEther !== '' ? inputEther : balance.toString()}
            onChange={(e) => setInputEther(e.target.value)}
            placeholder="Enter ether amount"
            className="input input-bordered input-xs"
          />
          <button
            type="button"
            className="btn btn-primary btn-xs"
            onClick={handleSetBalance}
          >
            Set Balance
          </button>
        </div>
      </td>
    </tr>
  );
};
