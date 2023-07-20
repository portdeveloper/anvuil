import { useState } from 'react';
import { toast } from 'react-toastify';
import { anvilClient } from 'renderer/client';
import { Block } from 'viem';

export const Blocks = ({ blocks }: { blocks: Block[] }) => {
  const [jumpTime, setJumpTime] = useState<number>(0);
  const [intervalMining, setIntervalMining] = useState<number>(0);
  const [blockTimestampInterval, setBlockTimestampInterval] =
    useState<number>(0);

  const handleSetIntervalMining = async () => {
    try {
      await anvilClient.setIntervalMining({
        interval: intervalMining,
      });
      toast.info(`Set automatic mining interval to ${intervalMining}`);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleSetJumpTime = async () => {
    try {
      await anvilClient.increaseTime({
        seconds: jumpTime,
      });
      toast.info(`Jumped ${jumpTime} seconds`);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleSetBlockTimestampInterval = async () => {
    try {
      await anvilClient.setBlockTimestampInterval({
        interval: blockTimestampInterval,
      });
      toast.info(`Set block timestamp interval to ${blockTimestampInterval}`);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleRemoveBlockTimestampInterval = async () => {
    try {
      await anvilClient.removeBlockTimestampInterval();
      toast.info(`Removed block timestamp interval`);
    } catch (error: any) {
      toast.error(error);
    }
  };

  return blocks.length === 0 ? (
    <div className="h-full flex items-center justify-center p-5 bg-gray-900 text-white">
      'No blocks yet.'
    </div>
  ) : (
    <div className="flex flex-col bg-gray-900">
      <div className="flex gap-4">
        <div>
          <input
            type="number"
            value={intervalMining}
            onChange={(e) => setIntervalMining(Number(e.target.value))}
            placeholder="Enter interval in seconds"
            className="text-black"
          />
          <button
            type="button"
            className="bg-pink-300"
            onClick={handleSetIntervalMining}
          >
            Set automatic mining interval
          </button>
        </div>
        <div>
          <div>
            <input
              type="number"
              value={jumpTime}
              onChange={(e) => setJumpTime(Number(e.target.value))}
              placeholder="Enter seconds to jump"
              className="text-black"
            />
            <button
              type="button"
              className="bg-pink-300"
              onClick={handleSetJumpTime}
            >
              Jump time
            </button>
          </div>
        </div>
        <div>
          <input
            type="number"
            value={blockTimestampInterval}
            onChange={(e) => setBlockTimestampInterval(Number(e.target.value))}
            placeholder="Enter seconds to jump"
            className="text-black"
          />
          <button
            type="button"
            className="bg-pink-300"
            onClick={handleSetBlockTimestampInterval}
          >
            Set block timestamp interval
          </button>
        </div>
        <div>
          <button
            className="bg-pink-300"
            onClick={handleRemoveBlockTimestampInterval}
          >
            Remove block timestamp interval
          </button>
        </div>
      </div>
      <div className="flex flex-col overflow-auto max-h-[calc(100vh-6em)]">
        {blocks.map((block) => (
          <div
            key={block.hash}
            className="flex flex-col bg-slate-500 p-4 text-white"
          >
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
