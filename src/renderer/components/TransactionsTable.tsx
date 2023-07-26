import { formatEther } from 'viem';
import { AddressComp, HashComp } from 'renderer/components';
import { TransactionExtended } from 'renderer/utils';

export const TransactionsTable = ({
  transactions,
}: {
  transactions: TransactionExtended[];
}) => {
  return (
    <div className="h-[550px]">
      <table className="table w-full table-compact">
        <thead>
          <tr>
            <th>Transaction Hash</th>
            <th>Block Number</th>
            <th>From</th>
            <th>To</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.hash} className="h-[50px]">
                <td>
                  <HashComp hash={tx.hash} type="transaction" />
                </td>
                <td>{Number(tx.blockNumber)}</td>
                <td>
                  <AddressComp address={tx.from} />
                </td>
                <td>
                  {tx.to === null ? (
                    <div className="relative">
                      <AddressComp address={tx.contractAddress} />
                      <span className="absolute top-4 left-8 text-xs">
                        (Contract Creation)
                      </span>
                    </div>
                  ) : (
                    <AddressComp address={tx.to} />
                  )}
                </td>
                <td>{formatEther(tx.value)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
