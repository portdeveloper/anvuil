import { useEffect, useState, useCallback } from 'react';
import { createWalletClient, http } from 'viem';
import { localhost } from 'viem/chains';
import AddressBlock from '../components/AddressBlock';

const localWalletClient = createWalletClient({
  chain: localhost,
  transport: http(),
});

export default function Accounts() {
  const [accounts, setAccounts] = useState<string[]>([]);

  const getAddresses = useCallback(async () => {
    const localAccounts = await localWalletClient.getAddresses();
    setAccounts(localAccounts);
  }, []);

  useEffect(() => {
    getAddresses();
  }, [getAddresses]);

  return (
    <div>
      {accounts.map((account) => (
        <AddressBlock key={account} address={account} />
      ))}
    </div>
  );
}
