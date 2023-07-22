import { Address, Hash } from 'viem';
import { AddressBlock, AddressComp, AddressInput } from '../components/';
import { useState } from 'react';
import { anvilClient } from 'renderer/client';
import { toast } from 'react-toastify';

export const Accounts = ({ accounts }: { accounts: Address[] }) => {
  const [impersonatedAccount, setImpersonatedAccount] = useState<string>('');
  const [isImpersonating, setIsImpersonating] = useState<boolean>(false);
  const [storageAddress, setStorageAddress] = useState<string>('');
  const [storageIndex, setStorageIndex] = useState<number>(0);
  const [storageValue, setStorageValue] = useState<string>('');
  const [bytecodeAddress, setBytecodeAddress] = useState<string>('');
  const [bytecodeValue, setBytecodeValue] = useState<string>('');

  const handleStartImpersonating = async () => {
    try {
      await anvilClient.impersonateAccount({
        address: impersonatedAccount as Address,
      });
      setIsImpersonating(true);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleStopImpersonating = async () => {
    try {
      await anvilClient.stopImpersonatingAccount({
        address: impersonatedAccount as Address,
      });
      setIsImpersonating(false);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleSetStorage = async () => {
    try {
      await anvilClient.setStorageAt({
        address: storageAddress as Address,
        index: storageIndex,
        value: storageValue as Hash,
      });
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleSetBytecode = async () => {
    try {
      await anvilClient.setCode({
        address: bytecodeAddress as Address,
        bytecode: bytecodeValue as Hash,
      });
    } catch (error: any) {
      toast.error(error);
    }
  };

  return accounts.length === 0 ? (
    <div className="h-full flex items-center justify-center p-5">
      Anvil is not running.
    </div>
  ) : (
    <div className="flex h-full ">
      <div className="px-3 py-2 flex flex-col gap-7 bg-secondary w-1/5">
        <div className="flex flex-col gap-1">
          <p>Impersonate account:</p>
          <AddressInput
            value={impersonatedAccount}
            onChange={setImpersonatedAccount}
            name="impersonatedAccount"
            placeholder="Enter address"
          />
          <button
            type="button"
            className="btn btn-xs w-full"
            onClick={handleStartImpersonating}
          >
            Start impersonating
          </button>
          <button
            type="button"
            className="btn btn-xs w-full"
            onClick={handleStopImpersonating}
          >
            Stop impersonating
          </button>
          <div>
            <p className="text-sm">Impersonated account:</p>
            {isImpersonating ? (
              <AddressComp address={impersonatedAccount as Address} />
            ) : (
              <p className="text-xs my-1">No account is impersonated</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p>Set contract storage:</p>
          <AddressInput
            value={storageAddress}
            onChange={setStorageAddress}
            name="storageAddress"
            placeholder="Enter address"
          />
          <input
            type="number"
            value={storageIndex}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              setStorageIndex(newValue >= 0 ? newValue : 0);
            }}
            placeholder="Enter index"
            className="input input-bordered input-sm w-full"
          />

          <input
            type="text"
            value={storageValue}
            onChange={(e) => setStorageValue(e.target.value)}
            placeholder="Enter value"
            className="input input-bordered input-sm w-full"
          />
          <button
            type="button"
            className="btn btn-xs w-full"
            onClick={handleSetStorage}
          >
            Set storage
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <p>Set contract bytecode:</p>
          <AddressInput
            value={bytecodeAddress}
            onChange={setBytecodeAddress}
            name="storageAddress"
            placeholder="Enter address"
          />
          <input
            type="text"
            value={bytecodeValue}
            onChange={(e) => setBytecodeValue(e.target.value)}
            placeholder="Enter bytecode"
            className="input input-bordered input-sm w-full"
          />
          <button
            type="button"
            className="btn btn-xs w-full"
            onClick={handleSetBytecode}
          >
            Set bytecode
          </button>
        </div>
      </div>
      <div className="px-5 flex w-full overflow-y-auto scrollbar-thin scrollbar-thumb-secondary">
        <table className="table w-full table-compact">
          <thead>
            <tr>
              <th>Address</th>
              <th>Nonce</th>
              <th>Balance in Ether</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <AddressBlock key={account} address={account} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
