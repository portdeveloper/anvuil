import { useEffect, useState } from 'react';
import { anvilClient } from 'renderer/client';

export const Blocks = () => {
  const [blocks, setBlocks] = useState<any[]>([]); // @todo type
  const [blockNumber, setBlockNumber] = useState<BigInt | null>(null);

  useEffect(() => {
    const unwatch = anvilClient.watchBlocks({
      emitOnBegin: true,
      onBlock: (block) => {
        console.log(block);
        setBlockNumber(block.number);
        setBlocks((prevBlocks) => [...prevBlocks, block]);
      },
    });

    return () => {
      unwatch();
    };
  }, []);

  return (
    <div className="flex flex-col flex-grow h-full items-center justify-center p-10 bg-gray-900 text-white">
      <h1>Block number: {blockNumber?.toString()}</h1>
      {blocks.map((block) => (
        <div>{block.transactions}</div>
      ))}
    </div>
  );
};
