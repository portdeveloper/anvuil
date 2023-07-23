import { useEffect, useState } from 'react';
import { anvilClient } from 'renderer/client';
import { Hash, Transaction } from 'viem';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

export const TransactionDetails = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
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
          setTransaction(tx);
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
    <div className="p-6">
      <button className="btn btn-primary btn-xs mb-5" onClick={handleBack}>
        Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Transaction Details</h1>

      <p className="mb-2">
        <span className="font-bold">Hash:</span> {transaction.hash}
      </p>
      <p className="mb-2">
        <span className="font-bold">From:</span> {transaction.from}
      </p>
      <p className="mb-2">
        <span className="font-bold">To:</span> {transaction.to}
      </p>
      <p className="mb-2">
        <span className="font-bold">Value:</span> {Number(transaction.value)}
      </p>
      <div>
        <p> Input:</p>
        <textarea
          readOnly
          value={transaction.input}
          className="p-0 textarea-primary bg-inherit w-full h-[200px] scrollbar-thin"
        />
      </div>
    </div>
  );
};
