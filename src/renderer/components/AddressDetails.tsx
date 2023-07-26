import { useNavigate, useParams } from 'react-router-dom';
import { Pagination } from './Pagination';
import { useState } from 'react';
import { TransactionsTable } from './TransactionsTable';
import { TransactionExtended } from 'renderer/utils';

const ADRESSES_PER_PAGE = 10;

export const AddressDetails = ({
  transactions,
}: {
  transactions: TransactionExtended[];
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const { address } = useParams();

  const indexOfLastAddress = currentPage * ADRESSES_PER_PAGE;
  const indexOfFirstAddress = indexOfLastAddress - ADRESSES_PER_PAGE;
  const currentTransactions = transactions.slice(
    indexOfFirstAddress,
    indexOfLastAddress
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const filteredTransactions = currentTransactions.filter(
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
      <div className="px-5 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-secondary ">
        <h2 className="text-2xl font-bold text-center">Address Details</h2>
        <TransactionsTable transactions={filteredTransactions} />
      </div>
      <Pagination
        currentPage={currentPage}
        totalItems={transactions.length}
        paginate={paginate}
      />
    </div>
  );
};
