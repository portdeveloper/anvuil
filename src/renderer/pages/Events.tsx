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

  return Object.keys(logs).length === 0 ? (
    <div className="h-full flex items-center justify-center p-5 bg-base-100 text-base-content">
      No events yet.
    </div>
  ) : (
    <div className="p-5 bg-base-100 text-base-content h-full overflow-auto">
      <h1 className="text-center text-2xl mb-2">Events</h1>
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
  );
};
