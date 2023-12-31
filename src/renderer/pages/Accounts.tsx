import { Address, Hash, isAddress, isHex } from 'viem';
import { AddressBlock, AddressComp, AddressInput } from '../components/';
import { useState } from 'react';
import { anvilClient } from 'renderer/client';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { AddressDetails } from 'renderer/components/AddressDetails';
import { TransactionExtended } from 'renderer/utils';

export const Accounts = ({
  accounts,
  transactions,
}: {
  accounts: Address[];
  transactions: TransactionExtended[];
}) => {
  const [impersonatedAccount, setImpersonatedAccount] = useState<string>('');
  const [isImpersonating, setIsImpersonating] = useState<boolean>(false);
  const [storageAddress, setStorageAddress] = useState<string>('');
  const [storageIndex, setStorageIndex] = useState<number>(0);
  const [storageValue, setStorageValue] = useState<string>('');
  const [bytecodeAddress, setBytecodeAddress] = useState<string>('');
  const [bytecodeValue, setBytecodeValue] = useState<string>('');
  const [updateInterval, setUpdateInterval] = useState<number>(5000); // default to updating every 5 seconds

  let { address } = useParams();

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
      <div className="px-3 py-2 flex flex-col gap-7 bg-secondary w-1/5 justify-between">
        <div className="flex flex-col gap-7">
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
              disabled={!isAddress(impersonatedAccount)}
            >
              Start impersonating
            </button>
            <button
              type="button"
              className="btn btn-xs w-full"
              onClick={handleStopImpersonating}
              disabled={!impersonatedAccount}
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
            <div className="tooltip" data-tip="Storage index">
              <input
                type="number"
                value={storageIndex}
                onChange={(e) => setStorageIndex(Number(e.target.value))}
                className="input input-bordered input-sm w-full"
                min={0}
              />
            </div>
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
              disabled={!isAddress(storageAddress)}
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
              disabled={!isAddress(bytecodeAddress) || !isHex(bytecodeValue)}
            >
              Set bytecode
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1 mb-2">
          <p>Set update interval (s)</p>
          <input
            type="range"
            min={1000}
            max={10000}
            step="1000"
            value={updateInterval}
            onChange={(e) => setUpdateInterval(Number(e.target.value))}
            className="range range-xs"
          />
          <div className="w-full flex justify-between text-xs">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
          </div>
        </div>
      </div>
      <div className="px-5 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-secondary">
        {address ? (
          <AddressDetails transactions={transactions} />
        ) : (
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
                <AddressBlock
                  key={account}
                  address={account}
                  updateInterval={updateInterval}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
