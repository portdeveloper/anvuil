import { toast } from 'react-toastify';
import { anvilClient } from 'renderer/client';
import { AddressComp, TxHashComp } from 'renderer/components';
import { Transaction } from 'viem';

export const Transactions = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  return (
    <div className="flex h-full">
      <div className="px-3 py-2 flex flex-col gap-7 bg-secondary w-1/5">
        <div className="flex flex-col gap-1"></div>
      </div>
      <div className="px-5 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-secondary">
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
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.hash}>
                  <td>
                    <TxHashComp txHash={tx.hash} />
                  </td>
                  <td>
                    <AddressComp address={tx.from} />
                  </td>
                  <td>
                    {tx.to === null ? (
                      <span className="text-xs">Contract Creation</span>
                    ) : (
                      <AddressComp address={tx.to} />
                    )}
                  </td>
                  <td>{Number(tx.value)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
