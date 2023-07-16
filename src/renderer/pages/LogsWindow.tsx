import { useEffect, useRef, useMemo, useState } from 'react';

interface OutputLine {
  timestamp: string;
  message: string;
  count: number;
}

export const LogsWindow = ({ output }: { output: OutputLine[] }) => {
  const logsContainerRef = useRef<HTMLPreElement | null>(null);
  const [manuallyScrolled, setManuallyScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!logsContainerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } =
        logsContainerRef.current;
      const atBottom = scrollHeight - scrollTop === clientHeight;

      setManuallyScrolled(!atBottom);
    };

    logsContainerRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      logsContainerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!manuallyScrolled && logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  }, [output, manuallyScrolled]);

  const outputString = useMemo(
    () =>
      output
        .map((line) => `[x${line.count}] ${line.timestamp} ${line.message}`)
        .join('\n'),
    [output]
  );

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
