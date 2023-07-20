import { Block } from 'viem';

export const Blocks = ({ blocks }: { blocks: Block[] }) => {
  return blocks.length === 0 ? (
    <div className="h-full flex items-center justify-center p-5 bg-gray-900 text-white">
      'No blocks yet.'
    </div>
  ) : (
    <div className="h-full flex justify-center p-5 bg-gray-900 text-white">
      <div className="flex flex-col gap-2 w-full max-h-[600px] overflow-auto">
        {blocks.map((block) => (
          <div key={block.hash} className="flex flex-col bg-slate-500 p-4">
            <p>Block hash: {block.hash}</p>
            <p>Gas limit: {Number(block.gasLimit)}</p>
            <p>Gas used: {Number(block.gasUsed)}</p>
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
