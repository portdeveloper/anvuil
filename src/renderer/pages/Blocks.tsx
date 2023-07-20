import { useState } from 'react';
import { toast } from 'react-toastify';
import { anvilClient } from 'renderer/client';
import { Block } from 'viem';

export const Blocks = ({ blocks }: { blocks: Block[] }) => {
  const [jumpTime, setJumpTime] = useState<number>(0);

  const handleSetJumpTime = async () => {
    try {
      await anvilClient.increaseTime({
        seconds: jumpTime,
      });
    } catch (error: any) {
      toast.error(error);
    }
  };

  return blocks.length === 0 ? (
    <div className="h-full flex items-center justify-center p-5 bg-gray-900 text-white">
      'No blocks yet.'
    </div>
  ) : (
    <div className="h-full flex bg-gray-900 text-white">
      <div className="flex flex-col w-full max-h-[600px] overflow-auto">
        <div>
          <div>
            <input
              type="number"
              value={jumpTime}
              onChange={(e) => setJumpTime(Number(e.target.value))}
              placeholder="Enter seconds to jump"
              className="text-black"
            />
            <button type="button" onClick={handleSetJumpTime}>
              Jump time
            </button>
          </div>
        </div>
        {blocks.map((block) => (
          <div key={block.hash} className="flex flex-col bg-slate-500 p-4">
            <p>Block hash: {block.hash}</p>
            <p>Gas limit: {Number(block.gasLimit)}</p>
            <p>Gas used: {Number(block.gasUsed)}</p>
            <p>
              timestamp:{' '}
              {new Date(Number(block.timestamp) * 1000).toLocaleString()}
            </p>
            <div>
              Transactions:
              {block.transactions.map((tx) => (
                <div key={tx.toString()}>
                  <p>{tx.toString()}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
