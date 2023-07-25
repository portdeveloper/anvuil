import { useEffect, useState } from 'react';
import { anvilClient } from 'renderer/client';
import { Hash, Block } from 'viem';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { HashComp } from './HashComp';

export const BlockDetails = () => {
  const [block, setBlock] = useState<Block | null>(null);
  const navigate = useNavigate();
  const { blockHash } = useParams(); // extracting txHash using useParams

  const handleBack = () => {
    navigate(-1); // navigates back to the previous page
  };

  useEffect(() => {
    if (blockHash) {
      const fetchBlock = async () => {
        try {
          const blk = await anvilClient.getBlock({
            blockHash: blockHash as Hash,
          });
          setBlock(blk);
        } catch (error: any) {
          toast.error(error);
        }
      };

      fetchBlock();
    }
  }, [blockHash]);

  if (blockHash === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-5">
      <button className="btn btn-sm btn-primary" onClick={handleBack}>
        Back
      </button>
      {block ? (
        <div>
          <h2 className="text-2xl font-bold mb-2 text-center">Block Details</h2>
          <table className="table w-full">
            <tbody>
              <tr>
                <td>
                  <strong>Block Hash:</strong>
                </td>
                <td>{block.hash}</td>
              </tr>
              <tr>
                <td>
                  <strong>Gas limit:</strong>
                </td>
                <td>{Number(block.gasLimit)}</td>
              </tr>
              <tr>
                <td>
                  <strong>Gas used:</strong>
                </td>
                <td>{Number(block.gasUsed)}</td>
              </tr>
              <tr>
                <td>
                  <strong>Block Number:</strong>
                </td>
                <td>{Number(block.number)}</td>
              </tr>
              <tr>
                <td>
                  <strong>Timestamp:</strong>
                </td>
                <td>
                  {new Date(Number(block.timestamp) * 1000).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Transactions:</strong>
                </td>
                <td>
                  {block.transactions.map((tx) => (
                    <HashComp
                      hash={tx as Hash}
                      type="transaction"
                      format="long"
                    />
                  ))}
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
