import { useState } from "react";
import axios from "axios";
import { ethers, providers } from "ethers";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { onnxToTxt } from "../../utils/onnxToJson";
import Spinner from "../Spinner";
import CodeSnippet from "../CodeSnippet";

interface StepsProps {
  setSteps: (x: number) => void;
}

const Step1Screen = ({ setSteps }: StepsProps) => {
  const [onnxBase64, setOnnxBase64] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [contractDeployed, setContractDeployed] = useState("");
  const [contractEZKL, setContractEZKL] = useState("");
  const [error, setError] = useState(false);

  const { isConnected } = useAccount();

  const disabledBtn =
    "flex justify-center bg-gray-700 px-5 py-3 rounded-lg text-white shadow-lg uppercase font-[600] w-[200px]";

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const base64 = await onnxToTxt(file);
    setOnnxBase64(base64);
  };

  const handleClickSendModel = async () => {
    setIsLoading(true);
    const onixSendData = {
      project_name: "test_project",
      echo_data: {
        input_shapes: [[3, 1, 1]],
        input_data: [
          [
            0.011350071988999844, 0.03404385969042778,
            0.04626564309000969,
          ],
        ],
        output_data: [
          [
            -0.36590576171875, -0.36590576171875, -0.36590576171875,
            -0.36590576171875, -0.3919677734375, -0.36590576171875,
            -0.36590576171875, -0.36590576171875, -0.36590576171875,
          ],
        ],
      },
      onnx_file_data: onnxBase64,
    };

    await axios
      .post("/api/generate_evm", { onixSendData: onixSendData })
      .then((res) => {
        if (res.status === 200) {
          setContractEZKL(res.data);
          return setIsLoading(false);
        }
        console.log(res);
      })
      .catch((err) => {
        console.log("ERROr", err);
        setError(true);
      });
  };

  const handleClickCompile = async () => {
    setIsDeploying(true);

    const response = await axios.get("/api/readSolFile");

    if (response.status !== 200) return;

    const contractSource = response.data.contractSource;

    const compileResponse = await fetch("/api/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contractSource }),
    });

    if (!compileResponse.ok) {
      const error = await compileResponse.json();

      console.log(error.message);
      console.log("Failed to compile contract");

      return;
    }

    const { contractJSON } = await compileResponse.json();

    const deployContract = async () => {
      try {
        // // Check if a user's wallet is connected
        if (!window.ethereum) {
          alert(
            "Please install MetaMask or another Ethereum wallet provider"
          );
          return;
        }

        if (isConnected === false) {
          alert(
            "Please install MetaMask or another Ethereum wallet provider"
          );
          return;
        }

        // Request access to the user's Ethereum account
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const signer = new ethers.providers.Web3Provider(
          window.ethereum as providers.ExternalProvider
        ).getSigner();

        // Create a ContractFactory instance with the compiled contract
        const contractFactory = new ethers.ContractFactory(
          contractJSON.Verifier.abi,
          contractJSON.Verifier.evm.bytecode.object,
          signer
        );

        // Deploy the contract
        const contract = await contractFactory.deploy();
        console.log("Contract deployment in progress...");

        // Wait for the contract to be mined
        await contract.deployed();
        console.log(
          "Contract deployed at address:",
          contract.address
        );
        setContractDeployed(contract.address);

        setIsDeploying(false);
      } catch (error) {
        setIsDeploying(false);
        console.error("Failed to deploy contract:", error);
      }
    };

    deployContract();
  };

  const goToNextStep = isConnected && contractDeployed.length > 2;

  return (
    <div className="flex bg-gray-800 w-5/6 rounded-[20px] mt-20 gap-10 flex-col items-center justify-between py-10">
      <div className="flex flex-col h-full w-full px-5 gap-20 items-center">
        <div className="flex gap-10 flex-col w-[300px] text-white text-center items-center">
          <h1 className="uppercase font-[600]">Upload a ONIX File</h1>
          <input
            type="file"
            accept=".onnx"
            onChange={handleFileChange}
            className="p-2 text-center justify-center align-center"
          />
          {onnxBase64.length > 1 && (
            <button
              disabled={isLoading ? true : false}
              onClick={() => handleClickSendModel()}
              className={
                isLoading
                  ? disabledBtn
                  : "flex bg-gradient-to-r justify-center from-green-300 via-blue-500 to-purple-600 text-white font-[600] uppercase rounded-[12px] p-3 w-[200px]"
              }
            >
              {isLoading ? <Spinner /> : "Send Model"}
            </button>
          )}
          {error && (
            <div className="flex justify-center bg-red-600 text-white font-[600] uppercase rounded-[12px] p-3 w-[250px]">
              Error while generating.
            </div>
          )}
        </div>
        <ConnectButton showBalance={false} />
        {contractEZKL.length > 10 && (
          <CodeSnippet code={contractEZKL} />
        )}

        {contractDeployed.length > 2 ? (
          <h3 className="text-white">✅ DEPLOYED</h3>
        ) : (
          <button
            onClick={() => handleClickCompile()}
            className={
              "flex bg-gradient-to-r justify-center from-green-300 via-blue-500 to-purple-600 text-white font-[600] uppercase rounded-[12px] p-3 w-[200px]"
            }
          >
            {isDeploying ? <Spinner /> : "Deploy"}
          </button>
        )}
      </div>

      <button
        onClick={() => setSteps(2)}
        disabled={!goToNextStep}
        className={
          goToNextStep
            ? "flex bg-gradient-to-r justify-center from-green-300 via-blue-500 to-purple-600 text-white font-[600] uppercase rounded-[12px] p-3 w-[200px]"
            : disabledBtn
        }
      >
        Next Step
      </button>
    </div>
  );
};

export default Step1Screen;
