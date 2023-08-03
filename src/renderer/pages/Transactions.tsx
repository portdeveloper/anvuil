import { Pagination, TransactionDetails } from 'renderer/components';
import { useParams } from 'react-router-dom';
import { TransactionsTable } from 'renderer/components/TransactionsTable';
import { TransactionExtended } from 'renderer/utils';
import { ITEMS_PER_PAGE } from 'renderer/constants';
import { usePagination } from 'renderer/hooks/usePagination';

export const Transactions = ({
  transactions,
}: {
  transactions: TransactionExtended[];
}) => {
  let { txHash } = useParams();

  const {
    currentItems: currentTransactions,
    currentPage,
    paginate,
  } = usePagination(transactions, ITEMS_PER_PAGE);

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
