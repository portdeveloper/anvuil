type HomeProps = {
  selectDirectory: () => void;
  anvilParams: string;
  setAnvilParams: (value: string) => void;
  startAnvil: () => void;
  killAnvil: () => void;
};

export const Home = ({
  selectDirectory,
  anvilParams,
  setAnvilParams,
  startAnvil,
  killAnvil,
}: HomeProps) => {
  return (
    <div className="flex-grow h-full flex items-center justify-center p-10">
      <div className="flex flex-col h-full w-1/3 gap-4 p-5 items-center">
        <button
          className="btn btn-primary btn-block "
          type="button"
          onClick={selectDirectory}
        >
          Select Directory
        </button>

        <input
          className="input input-primary bg-secondary w-full"
          type="text"
          value={anvilParams}
          onChange={(e) => setAnvilParams(e.target.value)}
          placeholder="Enter Anvil parameters"
        />

        <button
          className="btn btn-success btn-block"
          type="button"
          onClick={startAnvil}
        >
          Start Anvil
        </button>

        <button
          className="btn btn-error btn-block"
          type="button"
          onClick={killAnvil}
        >
          Stop Anvil
        </button>
      </div>
      <div className="flex flex-col h-full w-1/3 gap-4 p-5 items-center space-x-2">
        <div>testing...</div>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae
          unde rem omnis facere dolorem, reprehenderit fuga quod nesciunt nam
          impedit, officia porro accusantium labore molestias! Culpa voluptatum
          maxime unde laborum!
        </p>
      </div>
      <div className="flex flex-col h-full w-1/3 gap-4 p-5 items-center space-x-2">
        <div>testing...</div>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae
          unde rem omnis facere dolorem, reprehenderit fuga quod nesciunt nam
          impedit, officia porro accusantium labore molestias! Culpa voluptatum
          maxime unde laborum!
        </p>
      </div>
    </div>
  );
};
