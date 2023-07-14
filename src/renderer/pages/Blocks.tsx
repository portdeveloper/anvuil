import { useEffect, useState } from 'react';
import { anvilClient } from 'renderer/client';
import { Block } from 'viem';

export const Blocks = () => {
  const [blocks, setBlocks] = useState<Block[]>([]); // @todo type
  const [blockNumber, setBlockNumber] = useState<bigint>(0n);

  useEffect(() => {
    const unwatch = anvilClient.watchBlocks({
      emitOnBegin: true,
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
    <div className="flex flex-col flex-grow h-full items-center justify-center p-10 bg-gray-900 text-white">
      <h1>Block number: {blockNumber?.toString()}</h1>
      <div className="flex flex-col gap-4">
        {blocks.map((block) => (
          <div>
            <p key={block.hash} className="flex flex-col bg-slate-500 p-4">
              {block.hash}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
