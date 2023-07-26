import { Hash, Address, Transaction } from 'viem';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { HashComp } from './HashComp';
import { AddressComp } from './AddressComp';
import { Pagination } from './Pagination';
import { useState } from 'react';
import { TransactionsTable } from './TransactionsTable';

const ADRESSES_PER_PAGE = 10;

// @todo move this to a type file
type TransactionExtended = Transaction & {
  contractAddress: Address | null;
  status?: string;
  gasUsed?: bigint;
};

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
  const currentAddresses = transactions.slice(
    indexOfFirstAddress,
    indexOfLastAddress
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
      <div className="px-5 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-secondary ">
        <h2 className="text-2xl font-bold text-center">Address Details</h2>
        <TransactionsTable transactions={currentAddresses} />
      </div>
      <Pagination
        currentPage={currentPage}
        totalItems={transactions.length}
        paginate={paginate}
      />
    </div>
  );
};
