import { useEffect, useState } from 'react';
import { anvilClient } from 'renderer/client';
import { Block } from 'viem';

export const Blocks = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blockNumber, setBlockNumber] = useState<bigint>(0n);

  useEffect(() => {
    const unwatch = anvilClient.watchBlocks({
      onBlock: (block) => {
        console.log(block);
        setBlockNumber(block.number || 0n);
      },
    });

    return () => {
      unwatch();
    };
  }, []);

  useEffect(() => {
    const fetchBlocks = async () => {
      const fetchedBlocks = await Promise.all(
        Array.from(
          { length: Math.min(Number(blockNumber), 10) },
          (_, i) => blockNumber - BigInt(i)
        ).map((blockNum) => anvilClient.getBlock({ blockNumber: blockNum }))
      );

      setBlocks(fetchedBlocks);
    };

    if (blockNumber) {
      fetchBlocks();
    }
  }, [blockNumber]);

  return (
    <div className="flex flex-col items-center p-5 bg-gray-900 text-white overflow-hidden h-full">
      <h1>Block number: {blockNumber?.toString()}</h1>
      <div className="overflow-auto flex flex-col gap-4 w-full h-0 flex-grow">
        {blocks
          .slice()
          .reverse()
          .map((block) => (
            <div className="flex flex-col bg-slate-500 p-4">
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
