type OutputAction = { type: 'add'; lines: string[] } | { type: 'reset' };

interface OutputLine {
  timestamp: string;
  message: string;
  count: number;
}

const outputReducer = (state: OutputLine[], action: OutputAction) => {
  switch (action.type) {
    case 'add':
      const newLines = action.lines.map((line) => {
        const timestamp = `[${new Date().toLocaleString()}]`;
        const message = line.slice(line.indexOf(']') + 1);
        return { timestamp, message, count: 1 };
      });

      const lastLine = state[state.length - 1];
      if (lastLine) {
        newLines.forEach((newLine) => {
          if (newLine.message === lastLine.message) {
            lastLine.count += 1;
            newLine.count = 0; // mark this line for removal
          }
        });
      }

      return [...state, ...newLines.filter((line) => line.count > 0)];
    case 'reset':
      return [];
    default:
      throw new Error();
  }
};

export default outputReducer;
