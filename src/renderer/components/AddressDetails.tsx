import { Hash, Address, Transaction } from 'viem';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { HashComp } from './HashComp';
import { AddressComp } from './AddressComp';

export const AddressDetails = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  const navigate = useNavigate();
  const { address } = useParams();

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.from === address?.toLowerCase() || tx.to === address?.toLowerCase()
  );

  const handleBack = () => {
    navigate(-1); // navigates back to the previous page
  };

  return (
    <div className="container mx-auto p-5">
      <button className="btn btn-sm btn-primary" onClick={handleBack}>
        Back
      </button>
      {address ? (
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
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.hash}>
                  <td>
                    <HashComp hash={tx.hash} type="transaction" />
                  </td>
                  <td>{Number(tx.blockNumber)}</td>
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
      ) : (
        <div></div>
      )}
    </div>
  );
};
