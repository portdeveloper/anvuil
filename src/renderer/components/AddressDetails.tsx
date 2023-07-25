import { Hash, Address, Transaction } from 'viem';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { HashComp } from './HashComp';
import { AddressComp } from './AddressComp';
import { Pagination } from './Pagination';
import { useState } from 'react';

const ADRESSES_PER_PAGE = 10;

export const AddressDetails = ({
  transactions,
}: {
  transactions: Transaction[];
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
      {address ? (
        <div className="px-5 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-secondary ">
          <h2 className="text-2xl font-bold text-center">
            Address Details
          </h2>
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
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  currentAddresses.map((tx) => (
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
      ) : (
        <div></div>
      )}
      <Pagination
        currentPage={currentPage}
        totalItems={transactions.length}
        paginate={paginate}
      />
    </div>
  );
};
