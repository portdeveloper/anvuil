import { Address } from 'viem';
import { AddressBlock } from '../components/';

export const Accounts = ({ accounts }: { accounts: Address[] }) => {
  return accounts.length === 0 ? (
    <div className="h-full flex items-center justify-center p-5">
      Anvil is not running.
    </div>
  ) : (
    <div className="p-5 overflow-x-auto">
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
  );
};
