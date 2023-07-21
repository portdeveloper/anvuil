import { useState } from 'react';
import { toast } from 'react-toastify';
import { anvilClient } from 'renderer/client';
import { TxHashComp } from 'renderer/components/TxHashComp';
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
    <div className="h-full flex items-center justify-center p-5 bg-base-100 text-base-content">
      No blocks yet.
    </div>
  ) : (
    <div className="flex flex-col h-full gap-2 bg-base-100 text-base-content px-2 py-1">
      <div className="flex gap-4">
        <div className="form-control">
          <label className="label p-0">
            <span className="label-text">Interval Mining (seconds)</span>
          </label>
          <div className="flex">
            <input
              type="number"
              value={intervalMining}
              onChange={(e) => setIntervalMining(Number(e.target.value))}
              placeholder="Enter interval in seconds"
              className="input input-bordered input-xs flex-grow"
            />
            <button
              type="button"
              className="btn btn-primary btn-xs ml-2"
              onClick={handleSetIntervalMining}
            >
              Set
            </button>
          </div>
        </div>
        <div className="form-control">
          <label className="label p-0">
            <span className="label-text">Jump Time (seconds)</span>
          </label>
          <div className="flex">
            <input
              type="number"
              value={jumpTime}
              onChange={(e) => setJumpTime(Number(e.target.value))}
              placeholder="Enter seconds to jump"
              className="input input-bordered input-xs flex-grow"
            />
            <button
              type="button"
              className="btn btn-primary btn-xs ml-2"
              onClick={handleSetJumpTime}
            >
              Jump
            </button>
          </div>
        </div>
        <div className="form-control">
          <label className="label p-0">
            <span className="label-text">
              Block Timestamp Interval (seconds)
            </span>
          </label>
          <div className="flex">
            <input
              type="number"
              value={blockTimestampInterval}
              onChange={(e) =>
                setBlockTimestampInterval(Number(e.target.value))
              }
              placeholder="Enter seconds"
              className="input input-bordered input-xs flex-grow"
            />
            <button
              className="btn btn-primary btn-xs"
              onClick={handleRemoveBlockTimestampInterval}
            >
              Remove Interval
            </button>
            <button
              type="button"
              className="btn btn-primary btn-xs ml-2"
              onClick={handleSetBlockTimestampInterval}
            >
              Set Interval
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-auto max-h-[calc(100vh-6em)]">
        <table className="table w-full table-compact">
          <thead>
            <tr>
              <th>Block hash</th>
              <th>Gas limit</th>
              <th>Gas used</th>
              <th>Timestamp</th>
              <th>Transactions</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => (
              <tr key={block.hash} className="">
                <td>
                  <TxHashComp txHash={block.hash} />
                </td>
                <td>{Number(block.gasLimit)}</td>
                <td>{Number(block.gasUsed)}</td>
                <td>
                  {new Date(Number(block.timestamp) * 1000).toLocaleString()}
                </td>
                <td>
                  {block.transactions.map((tx) => (
                    <div key={tx.toString()} className="p-2">
                      {tx.toString()}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
