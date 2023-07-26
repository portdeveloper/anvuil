import { Pagination, TransactionDetails } from 'renderer/components';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { TransactionsTable } from 'renderer/components/TransactionsTable';
import { TransactionExtended } from 'renderer/utils';

const TRANSACTIONS_PER_PAGE = 10;

export const Transactions = ({
  transactions,
}: {
  transactions: TransactionExtended[];
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  let { txHash } = useParams();

  const indexOfLastTransaction = currentPage * TRANSACTIONS_PER_PAGE;
  const indexOfFirstTransaction =
    indexOfLastTransaction - TRANSACTIONS_PER_PAGE;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex h-full">
      <div className="px-3 py-2 flex flex-col gap-7 bg-secondary w-1/5">
        <div className="flex flex-col gap-1"></div>
      </div>
      <div className="px-5 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-secondary">
        {txHash ? (
          <TransactionDetails />
        ) : (
          <div>
            <TransactionsTable transactions={currentTransactions} />
            <Pagination
              currentPage={currentPage}
              totalItems={transactions.length}
              paginate={paginate}
            />
          </div>
        )}
      </div>
    </div>
  );
};
