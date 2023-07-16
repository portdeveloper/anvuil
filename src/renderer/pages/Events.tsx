import { useContext } from 'react';
import { BlocksContext } from '../BlocksContext';

export const Events = () => {
  const { logs } = useContext(BlocksContext);

  return (
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
                  <p>{Number(value)}</p>
                </div>
              </details>
            ))}
          </details>
        ))}
      </div>
    </div>
  );
};
