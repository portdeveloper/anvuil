import { AddressComp, TxHashComp } from 'renderer/components';
import { Transaction } from 'viem';

export const Transactions = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  return transactions.length === 0 ? (
    <div className="h-full flex items-center justify-center p-5 bg-base-100 text-base-content">
      No transactions yet.
    </div>
  ) : (
    <div className="h-full p-5 bg-base-100 text-base-content overflow-auto">
      <table className="table w-full table-compact">
        <thead>
          <tr>
            <th>Transaction Hash</th>
            <th>From</th>
            <th>To</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.hash}>
              <td>
                <TxHashComp txHash={tx.hash} />
              </td>
              <td>
                <AddressComp address={tx.from} />
              </td>
              <td>
                <AddressComp address={tx.to} />
              </td>
              <td>{Number(tx.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
