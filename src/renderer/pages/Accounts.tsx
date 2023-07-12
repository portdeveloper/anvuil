import AddressBlock from '../components/AddressBlock';

interface AccountsProps {
  accounts: string[];
}

export default function Accounts({ accounts }: AccountsProps) {
  // Here we no longer need getAddresses or the local state for accounts

  return (
    <div>
      {accounts.map((account) => (
        <AddressBlock key={account} address={account} />
      ))}
    </div>
  );
}
