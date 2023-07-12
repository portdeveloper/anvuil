import AddressBlock from '../components/AddressBlock';

interface AccountsProps {
  accounts: string[];
}

export default function Accounts({ accounts }: AccountsProps) {
  return (
    <div>
      {accounts.map((account) => (
        <AddressBlock key={account} address={account} />
      ))}
    </div>
  );
}
