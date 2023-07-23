import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { anvilClient } from 'renderer/client';
import { Hash } from 'viem';

type HomeProps = {
  selectDirectory: () => void;
  anvilParams: string;
  setAnvilParams: (value: string) => void;
  startAnvil: () => void;
  killAnvil: () => void;
};

/**
 * @todo check if setLoggingEnabled works
 * is it enabled or disabled by default?
 */

export const Home = ({
  selectDirectory,
  anvilParams,
  setAnvilParams,
  startAnvil,
  killAnvil,
}: HomeProps) => {
  const [resetForkBlockNumber, setResetForkBlockNumber] = useState<number>(0);
  const [resetForkRpcUrl, setResetForkRpcUrl] = useState<string>('');
  const [loggingEnabled, setLoggingEnabled] = useState<boolean>(false);
  const [RpcUrl, setRpcUrl] = useState<string>('');
  const [snapshotId, setSnapshotId] = useState<string>('');

  const handleResetFork = async () => {
    try {
      await anvilClient.reset({
        blockNumber: BigInt(resetForkBlockNumber),
        jsonRpcUrl: resetForkRpcUrl,
      });
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleSetRpcUrl = async () => {
    try {
      await anvilClient.setRpcUrl(RpcUrl);
    } catch (error: any) {
      toast.error(error);
    }
  };

  useEffect(() => {
    const handleSetLoggingEnabled = async () => {
      try {
        await anvilClient.setLoggingEnabled(loggingEnabled);
      } catch (error: any) {
        toast.error(error);
      }
    };

    handleSetLoggingEnabled();
  }, [loggingEnabled]);

  const handleSnapshotState = async () => {
    try {
      await anvilClient.snapshot();
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleRevertState = async () => {
    try {
      await anvilClient.revert({
        id: snapshotId as Hash,
      });
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="flex h-full">
      <div className="px-3 py-2 flex flex-col gap-7 bg-secondary w-1/5">
        <div className="flex flex-col gap-1">
          <p>Reset fork:</p>
          <input
            type="number"
            value={resetForkBlockNumber}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              setResetForkBlockNumber(newValue >= 0 ? newValue : 0);
            }}
            placeholder="Enter block number"
            className="input input-bordered input-sm w-full"
          />
          <input
            type="text"
            value={resetForkRpcUrl}
            onChange={(e) => setResetForkRpcUrl(e.target.value)}
            placeholder="Enter RPC URL"
            className="input input-bordered input-sm w-full"
          />
          <button
            type="button"
            className="btn btn-xs w-full"
            onClick={handleResetFork}
          >
            Reset fork
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <p>Set RPC URL</p>
          <input
            type="text"
            value={RpcUrl}
            onChange={(e) => setRpcUrl(e.target.value)}
            placeholder="Enter RPC URL"
            className="input input-bordered input-sm w-full"
          />
          <button
            type="button"
            className="btn btn-xs w-full"
            onClick={handleSetRpcUrl}
          >
            Set RPC URL
          </button>
        </div>
        <div className="flex gap-1 form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Set logging enabled</span>
            <input
              type="checkbox"
              checked={loggingEnabled}
              onChange={(e) => setLoggingEnabled(e.target.checked)}
              className="toggle toggle-primary toggle-sm"
            />
          </label>
        </div>
        <div className="flex gap-1 form-control">
          <p>Snapshot</p>
          <button
            type="button"
            className="btn btn-xs w-full"
            onClick={handleSnapshotState}
          >
            Snapshot
          </button>
          <p>Revert</p>
          <input
            type="text"
            value={snapshotId}
            onChange={(e) => setSnapshotId(e.target.value)}
            placeholder="Enter snapshot ID"
            className="input input-bordered input-sm w-full"
          />
          <button
            type="button"
            className="btn btn-xs w-full"
            onClick={handleRevertState}
          >
            Revert to snapshot
          </button>
        </div>
      </div>
      <div className="px-5 w-full">
        <div className="w-full flex justify-between text-xs px-2 py-4">
          <div className="flex flex-col gap-2 w-1/3">
            <button
              className="btn btn-sm w-full"
              type="button"
              onClick={selectDirectory}
            >
              Select Directory
            </button>

            <input
              className="input input-bordered input-sm w-full"
              type="text"
              value={anvilParams}
              onChange={(e) => setAnvilParams(e.target.value)}
              placeholder="Enter Anvil parameters"
            />

            <button
              className="btn btn-success btn-sm"
              type="button"
              onClick={startAnvil}
            >
              Start Anvil
            </button>

            <button
              className="btn btn-error btn-sm"
              type="button"
              onClick={killAnvil}
            >
              Stop Anvil
            </button>
          </div>
          <div className="flex flex-col gap-2 w-1/3">
            <div className="flex justify-center px-5">
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum
                distinctio, asperiores facilis quod quia maxime exercitationem
                consequuntur nostrum? Nobis laboriosam vel est, fugit
                dignissimos asperiores molestias id voluptates. Consequuntur,
                culpa.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-1/3 px-5">
            <div className="flex justify-center">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
                saepe qui porro libero, officiis quasi! Eum facilis cum cumque,
                molestias optio itaque accusamus rem numquam magni nemo hic
                nulla nobis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
