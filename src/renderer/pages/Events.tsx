import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { anvilClient } from 'renderer/client';
import { Log } from 'viem';

export const Events = () => {
  const [logs, setLogs] = useState<Log[]>([]);

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

    const intervalId = setInterval(fetchLogs, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex h-full">
      <div className="px-3 py-2 flex flex-col gap-7 bg-secondary w-1/5">
        {/* Add controls here, if required */}
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
