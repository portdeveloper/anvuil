import { useEffect } from 'react';
import AddressBlock from '../components/AddressBlock';

export default function Accounts({
  accounts,
  getAddresses,
}: {
  accounts: string[];
  getAddresses: () => void;
}) {
  useEffect(() => {
    getAddresses();
  }, []);
  return (
    <div className="flex-grow flex-col gap-5 h-full w-full flex items-center justify-center p-5 bg-gray-800 text-white">
      <div className="flex flex-col gap-2 w-full overflow-auto max-h-[600px] bg-gray-700 rounded-lg p-5">
        {accounts.map((account) => (
          <div
            key={account}
            className="flex justify-between items-center bg-gray-600 px-2 py-3 rounded-md"
          >
            <p className="text-green-400 font-mono px-2">{account}</p>
            <AddressBlock address={account} />
          </div>
        ))}
      </div>
    </div>
  );
}
