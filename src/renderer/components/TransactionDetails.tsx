import { useEffect, useState } from 'react';
import { anvilClient } from 'renderer/client';
import { Hash, Transaction } from 'viem';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * @todo add contract address if there is a contract created
 */

export const TransactionDetails = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [confirmations, setConfirmations] = useState<Number | null>(null);

  const navigate = useNavigate();
  const { txHash } = useParams(); // extracting txHash using useParams

  const handleBack = () => {
    navigate(-1); // navigates back to the previous page
  };

  useEffect(() => {
    if (txHash) {
      const fetchTransaction = async () => {
        try {
          const tx = await anvilClient.getTransaction({
            hash: txHash as Hash,
          });
          const confirmations = await anvilClient.getTransactionConfirmations({
            hash: txHash as Hash,
          });
          setTransaction(tx);
          setConfirmations(Number(confirmations));
        } catch (error: any) {
          toast.error(error);
        }
      };

      fetchTransaction();
    }
  }, [txHash]);

  if (transaction === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-5">
      <button className="btn btn-sm btn-primary" onClick={handleBack}>
        Back
      </button>
      {transaction ? (
        <div>
          <h2 className="text-2xl font-bold mb-2 text-center">
            Transaction Details
          </h2>
          <table className="table w-full">
            <tbody>
              <tr>
                <td>
                  <strong>Transaction Hash:</strong>
                </td>
                <td>{transaction.hash}</td>
              </tr>
              <tr>
                <td>
                  <strong>From:</strong>
                </td>
                <td>{transaction.from}</td>
              </tr>
              <tr>
                <td>
                  <strong>To:</strong>
                </td>
                <td>{transaction.to}</td>
              </tr>
              <tr>
                <td>
                  <strong>Value:</strong>
                </td>
                <td>{Number(transaction.value)}</td>
              </tr>
              <tr>
                <td>
                  <strong>Confirmations:</strong>
                </td>
                <td>{Number(confirmations)}</td>
              </tr>
              <tr>
                <td>
                  <strong>Input:</strong>
                </td>
                <td className="form-control">
                  <textarea
                    readOnly
                    value={transaction.input}
                    className="p-0 textarea-primary bg-inherit h-[250px]"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-2xl text-base-content">Loading...</p>
      )}
    </div>
  );
};
