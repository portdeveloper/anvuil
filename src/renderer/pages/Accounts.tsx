import AddressBlock from '../components/AddressBlock';

interface AccountsProps {
  accounts: string[];
}

export default function Accounts({ accounts }: AccountsProps) {
  return (
    <div className="h-full flex items-center justify-center p-5 bg-gray-900 text-white">
      {accounts.length > 0 ? (
        <div className="flex flex-col gap-2 w-full">
          {accounts.map((account) => (
            <AddressBlock key={account} address={account} />
          ))}
        </div>
      ) : (
        <div>No accounts yet. Did you start anvil?</div>
      )}
    </div>
  );
}
