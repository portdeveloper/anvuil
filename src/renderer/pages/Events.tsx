import { Log } from 'viem';

export const Events = ({ logs }: { logs: Log[] }) => {
  return Object.keys(logs).length === 0 ? (
    <div className="h-full flex items-center justify-center p-5 bg-gray-900 text-white">
      No events yet.
    </div>
  ) : (
    <div className="flex items-center p-5 bg-gray-900 text-white overflow-hidden h-full">
      <div className="flex flex-col h-full gap-4 p-5 w-full">
        <h1 className="text-center">Events</h1>
        {Object.entries(logs).map(([key, event]) => (
          <details key={key}>
            <summary className="text-xl">{key}</summary>
            {Object.entries(event).map(([property, value]) => (
              <details key={property} className="ml-4">
                <summary>{property}</summary>
                <div className="ml-4">
                  <p>{value as any}</p>
                </div>
              </details>
            ))}
          </details>
        ))}
      </div>
    </div>
  );
};
