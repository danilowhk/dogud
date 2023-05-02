import { useState, ChangeEvent } from "react";

interface StepsProps {
  setSteps: (x: number) => void;
}

interface InputValue {
  value: string;
}
const Step2Screen = ({ setSteps }: StepsProps) => {
  const [inputs, setInputs] = useState<InputValue[]>([{ value: "" }]);

  const handleInputChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newInputs = [...inputs];
    newInputs[index].value = event.target.value;
    setInputs(newInputs);
  };

  const handleAddInput = () => {
    setInputs([...inputs, { value: "" }]);
  };

  const handleRemoveInput = (index: number) => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };

  return (
    <div className="flex h-[70vh] gap-10 flex-col items-center justify-between py-10">
      <div className="flex gap-5 flex-col w-[300px]">
        {inputs.map((input, index) => (
          <div
            key={index}
            className="flex gap-2 flex-row items-start"
          >
            <input
              type="text"
              className="bg-gray-300 rounded-lg p-2 w-full"
              value={input.value}
              onChange={(event) => handleInputChange(index, event)}
            />
            <button
              className="bg-black h-full text-white p-2 rounded-lg"
              onClick={() => handleRemoveInput(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <button
            className="bg-black text-white rounded-[12px] p-3 w-3/6"
            onClick={handleAddInput}
          >
            Add Input
          </button>
          <button
            className="bg-black text-white rounded-[12px] p-3 w-3/6"
            onClick={() => console.log("ADD THOSE ADDRESSES")}
          >
            Add Address
          </button>
        </div>
      </div>

      <button
        onClick={() => setSteps(3)}
        className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 text-white font-[600] uppercase rounded-[12px] p-3 w-[200px]"
      >
        Next Step
      </button>
    </div>
  );
};

export default Step2Screen;
