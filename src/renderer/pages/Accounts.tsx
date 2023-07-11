import { useState } from 'react';
import { createWalletClient, http } from 'viem';
import { localhost } from 'viem/chains';
import AddressBlock from '../components/AddressBlock';

const localWalletClient = createWalletClient({
  chain: localhost,
  transport: http(),
});

export default function Accounts() {
  const [accounts, setAccounts] = useState<string[]>([]);

  async function getAddresses() {
    const localAccounts = await localWalletClient.getAddresses();
    setAccounts(localAccounts);
  }

  return (
    <div className="flex-grow flex-col gap-5 h-full w-full flex items-center justify-center p-10 bg-gray-900 text-white">
      <h2 className="text-2xl">Accounts</h2>
      <div>
        {accounts.map((account) => (
          <p>
            {account} <AddressBlock address={account} />
          </p>
        ))}
      </div>
      <button
        type="button"
        className="bg-red-400 px-4 py-2"
        onClick={getAddresses}
      >
        Get Addresses
      </button>
    </div>
  );
}
