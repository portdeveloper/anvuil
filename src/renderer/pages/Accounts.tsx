import { Address } from 'viem';
import { AddressBlock } from '../components/';

interface AccountsProps {
  accounts: Address[];
}

export const Accounts = ({ accounts }: AccountsProps) => {
  return (
    <div className="h-full flex items-center justify-center p-5 bg-gray-900 text-white">
      {accounts.length > 0 ? (
        <div className="flex flex-col gap-2 w-full max-h-[600px] overflow-auto">
          {accounts.map((account) => (
            <AddressBlock key={account} address={account} />
          ))}
        </div>
      ) : (
        <div>No accounts yet, please start anvil</div>
      )}
    </div>
  );
};
