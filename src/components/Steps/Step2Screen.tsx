import { useState, ChangeEvent } from "react";
import CodeSnippet from "../CodeSnippet";

interface StepsProps {
  setSteps: (x: number) => void;
}

const Step2Screen = ({ setSteps }: StepsProps) => {
  const [selectedContract, setSelectedContract] = useState("");
  const [contracts] = useState([
    {
      name: "ERC20",
      code: `// SPDX-License-Identifier: MIT
      pragma solidity ^0.8.9;
      
      import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
      import "@openzeppelin/contracts/access/Ownable.sol";
      
      contract Tara is ERC20, Ownable {
          constructor() ERC20("TARA", "TARA") {}
      
          function mint(address to, uint256 amount) public onlyOwner {
              _mint(to, amount);
          }
      }`,
    },
  ]);

  const handleContractChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedContract(selected);
  };

  const selectedContractCode = contracts.find(
    (contract) => contract.name === selectedContract
  )?.code;

  return (
    <div className="flex h-[70vh] gap-10 flex-col items-center justify-between py-10">
      <div className="w-full flex flex-col items-center">
        <h2 className="text-xl font-bold text-white mb-4">
          Select a Contract model
        </h2>
        <select
          value={selectedContract}
          onChange={handleContractChange}
          className="mb-4 p-2 border border-white rounded-md text-white bg-gray-700"
        >
          <option value="">-- Select a Contract --</option>
          {contracts.map((contract) => (
            <option key={contract.name} value={contract.name}>
              {contract.name}
            </option>
          ))}
        </select>
        {selectedContractCode && <CodeSnippet code={selectedContractCode} />}
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
