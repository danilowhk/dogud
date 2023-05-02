interface StepFollow {
  steps: number;
}

const StepFollow = ({ steps }: StepFollow) => {
  const activated =
    "bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 text-white uppercase font-[600] px-5 py-2 rounded-lg";
  const desActivated =
    "bg-gray-700 px-5 py-2 rounded-lg text-white shadow-lg uppercase font-[600]";
  return (
    <div className="flex gap-10 w-full justify-center flex-row p-2">
      <h1 className={steps >= 1 ? activated : desActivated}>
        Step 1
      </h1>
      <h1 className={steps >= 2 ? activated : desActivated}>
        Step 2
      </h1>
      <h1 className={steps >= 3 ? activated : desActivated}>
        Step 3
      </h1>
    </div>
  );
};

export default StepFollow;
