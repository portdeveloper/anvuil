import { useContext } from 'react';
import { BlocksContext } from '../BlocksContext';

export const Blocks = () => {
  const { blocks } = useContext(BlocksContext);

  return (
    <div className="flex flex-col items-center p-5 bg-gray-900 text-white overflow-hidden h-full">
      <div className="overflow-auto flex flex-col gap-4 w-full h-0 flex-grow">
        {blocks.map((block) => (
          <div key={block.hash} className="flex flex-col bg-slate-500 p-4">
            <p key={block.hash}>Block hash: {block.hash}</p>
            <p>Gas limit: {Number(block.gasLimit)}</p>
            <p>Gas used: {Number(block.gasUsed)}</p>
            <div>
              Transactions:
              {block.transactions.map((tx) => (
                <div>
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
