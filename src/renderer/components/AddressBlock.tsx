import { useEffect, useState } from 'react';
import { formatEther, parseEther, Address } from 'viem';
import { anvilClient } from 'renderer/client';
import { AddressComp } from './AddressComp';
/**
 * @todo need a way to update this component when the balance or nonce changes
 */

export const AddressBlock = ({ address }: { address: Address }) => {
  const [nonce, setNonce] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>('');
  const [inputEther, setInputEther] = useState<string>('');
  const [inputNonce, setInputNonce] = useState<string>('');

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
  }, []);

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
    <tr>
      <td>
        <AddressComp address={address} />
      </td>
      <td>
        <div className="form-control flex flex-row">
          <input
            type="text"
            value={nonce !== null ? nonce : inputNonce}
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
        <div className="form-control flex flex-row">
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
