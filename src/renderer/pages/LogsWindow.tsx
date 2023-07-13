import { useEffect, useRef, useMemo } from 'react';

export const LogsWindow = ({ output }: { output: string[] }) => {
  const logsContainerRef = useRef<HTMLPreElement | null>(null);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  }, [output]);

  const outputString = useMemo(() => output.join('\n'), [output]);

  if (!output.length) {
    return (
      <div className="flex-grow h-full flex items-center justify-center p-10 bg-gray-900 text-white">
        <h1>No logs yet, please start anvil</h1>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center h-full bg-gray-900 text-white px-5">
      <pre
        ref={logsContainerRef}
        className="flex-grow w-full max-h-[600px] overflow-auto text-sm"
      >
        {outputString}
      </pre>
    </div>
  );
};
