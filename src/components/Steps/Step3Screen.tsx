import React, { useState } from "react";
import CodeSnippet from "../CodeSnippet";

interface StepsProps {
  setSteps: (x: number) => void;
}

const Step3Screen: React.FC<StepsProps> = ({ setSteps }) => {
  const [proofResponse, setProofResponse] = useState("");

  const handleProofClick = async () => {
    // Replace this URL with the actual API endpoint you're using
    const apiURL = "https://example.com/api/zk-proof";

    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      setProofResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error fetching proof:", error);
      setProofResponse("Error fetching proof");
    }
  };

  return (
    <div className="flex h-[70vh] gap-10 flex-col items-center justify-between py-10">
      <div className="w-full flex flex-col items-center">
        <h2 className="text-xl font-bold text-white mb-4">
          Zero Knowledge Proof
        </h2>
        <button
          onClick={handleProofClick}
          className="bg-gradient-to-r from-green-300 to-blue-300 text-white font-semibold py-2 px-4 rounded-md mb-4"
        >
          Proof
        </button>
        {proofResponse && <CodeSnippet code={proofResponse} />}
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

export default Step3Screen;
