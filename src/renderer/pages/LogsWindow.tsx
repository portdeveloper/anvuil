import { useEffect, useRef, useMemo, useState } from 'react';

interface OutputLine {
  timestamp: string;
  message: string;
  count: number;
}

export const LogsWindow = ({
  output,
  dispatchOutput,
}: {
  output: OutputLine[];
  dispatchOutput: Function;
}) => {
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
      <div className="flex-grow h-full flex items-center justify-center p-10 ">
        <h1>No logs yet, please start anvil</h1>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center h-full px-5">
      <button
        type="button"
        className="btn btn-primary btn-xs m-3"
        onClick={() => dispatchOutput({ type: 'reset' })}
      >
        Reset logs
      </button>
      <pre
        ref={logsContainerRef}
        className="flex-grow w-full max-h-[600px] overflow-auto text-sm"
      >
        {outputString}
      </pre>
    </div>
  );
};
