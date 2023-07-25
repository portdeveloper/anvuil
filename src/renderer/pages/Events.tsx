import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { anvilClient } from 'renderer/client';
import { Log } from 'viem';

export const Events = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [updateInterval, setUpdateInterval] = useState<number>(5000); // default to updating every 5 seconds

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logs = await anvilClient.getLogs({
          fromBlock: 0n,
        });
        console.log('⚠️⚠️⚠️ Events are fetched inside Events.tsx');

        setLogs(logs);
      } catch (error: any) {
        toast.error(error);
      }
    };

    fetchLogs();

    const intervalId = setInterval(fetchLogs, updateInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [updateInterval]);

  return (
    <div className="flex h-full">
      <div className="px-3 py-2 flex flex-col gap-7 bg-secondary w-1/5 justify-between">
        <div></div>
        <div className="flex flex-col gap-1 mb-2">
          <p>Set update interval (s)</p>
          <input
            type="range"
            min={1000}
            max={10000}
            step="1000"
            value={updateInterval}
            onChange={(e) => setUpdateInterval(Number(e.target.value))}
            className="range range-xs"
          />
          <div className="w-full flex justify-between text-xs">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
          </div>
        </div>
      </div>
      <div className="px-5 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-secondary">
        <table className="table w-full table-compact">
          <thead>
            <tr>
              <th>Event Key</th>
              <th>Event Properties</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(logs).map(([key, event]) => (
              <tr key={key}>
                <td className="font-mono">{key}</td>
                <td>
                  {Object.entries(event).map(([property, value]) => (
                    <div key={property}>
                      <strong>{property}: </strong>
                      <span>{value as any}</span>
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
