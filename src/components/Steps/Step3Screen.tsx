interface StepsProps {
  setSteps: (x: number) => void;
}

const Step1Screen = ({ setSteps }: StepsProps) => {
  return (
    <div className="flex h-[70vh] gap-10 flex-col items-center justify-between py-10">
      <div className="flex flex-col h-full gap-20 items-center">
        <div className="flex gap-10 flex-col w-[300px] text-white text-center">
          <h1 className="uppercase font-[600]">Upload a ONIX File</h1>
        </div>
      </div>

      <button
        onClick={() => setSteps(4)}
        className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 text-white font-[600] uppercase rounded-[12px] p-3 w-[200px]"
      >
        Next Step
      </button>
    </div>
  );
};

export default Step1Screen;
