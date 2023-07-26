import { useNavigate, useParams } from 'react-router-dom';
import { Pagination } from './Pagination';
import { useEffect, useState } from 'react';
import { TransactionsTable } from './TransactionsTable';
import { TransactionExtended } from 'renderer/utils';
import { anvilClient } from 'renderer/client';
import { Address, toHex } from 'viem';

const ADRESSES_PER_PAGE = 10;

export const AddressDetails = ({
  transactions,
}: {
  transactions: TransactionExtended[];
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bytecode, setBytecode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('transactions');
  const [slot, setSlot] = useState<bigint>(0n); // Keep track of the current slot number
  const [storageData, setStorageData] = useState<string | null>(null); // Store the data from the chosen slot

  const { address } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkIsContract = async () => {
      const contractBytecode = await anvilClient.getBytecode({
        address: address as Address,
      });
      setBytecode(contractBytecode !== '0x' ? contractBytecode : null);
    };

    checkIsContract();
  }, [address]);

  const fetchStorage = async () => {
    if (bytecode) {
      const storageSlotData = await anvilClient.getStorageAt({
        address: address as Address,
        slot: toHex(slot), // Convert the slot number to Hex
      });
      setStorageData(storageSlotData);
    }
  };

  useEffect(() => {
    fetchStorage();
  }, [address, bytecode, slot]);

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
      <div>
        <div className="px-5 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-secondary ">
          <h2 className="text-2xl font-bold text-center">Address Details</h2>
          {bytecode && (
            <div className="tabs">
              <button
                className={`tab tab-lifted ${
                  activeTab === 'transactions' ? 'tab-active' : ''
                }`}
                onClick={() => setActiveTab('transactions')}
              >
                Transactions
              </button>
              <button
                className={`tab tab-lifted ${
                  activeTab === 'code' ? 'tab-active' : ''
                }`}
                onClick={() => setActiveTab('code')}
              >
                Code
              </button>
              <button
                className={`tab tab-lifted ${
                  activeTab === 'storage' ? 'tab-active' : ''
                }`}
                onClick={() => setActiveTab('storage')}
              >
                Storage
              </button>
              <button
                className={`tab tab-lifted ${
                  activeTab === 'logs' ? 'tab-active' : ''
                }`}
                onClick={() => setActiveTab('logs')}
              >
                Logs
              </button>
            </div>
          )}
        </div>
        {activeTab === 'transactions' && (
          <>
            <TransactionsTable transactions={filteredTransactions} />
            <Pagination
              currentPage={currentPage}
              totalItems={transactions.length}
              paginate={paginate}
            />
          </>
        )}
        {activeTab === 'code' && (
          <div className="p-5">
            <h3 className="mb-2 font-semibold">Bytecode</h3>
            <div className="mockup-code -indent-5 overflow-y-auto max-h-[500px]">
              <pre className="px-5">
                <code className="whitespace-pre-wrap overflow-auto break-words">
                  {bytecode}
                </code>
              </pre>
            </div>
          </div>
        )}
        {activeTab === 'storage' && (
          <div className="p-5">
            <div className="form-control flex flex-row mb-4">
              <label className="label">
                <span className="label-text">Slot number:</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-1/12"
                value={slot.toString()}
                onChange={(e) => setSlot(BigInt(e.target.value))}
                min="0"
              />
            </div>
            <div className="mockup-code -indent-5 overflow-y-auto max-h-[500px]">
              <pre className="px-5">
                <code className="whitespace-pre-wrap overflow-auto break-words">
                  {storageData}
                </code>
              </pre>
            </div>
          </div>
        )}
        {activeTab === 'logs' && <div>logs tab</div>}
      </div>
    </div>
  );
};
