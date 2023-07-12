type OutputAction = { type: 'add'; lines: string[] } | { type: 'reset' };

const outputReducer = (state: string[], action: OutputAction) => {
  switch (action.type) {
    case 'add':
      return [
        ...state,
        ...action.lines.map(
          (line: string) => `[${new Date().toLocaleString()}] ${line}`
        ),
      ];
    case 'reset':
      return [];
    default:
      throw new Error();
  }
};

export default outputReducer;
