function LogsWindow({ output }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 text-blue-500">
      <pre className="w-full bg-black text-white p-4 rounded">{output}</pre>
    </div>
  );
}

export default LogsWindow;
