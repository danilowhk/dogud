import React, { useState } from "react";
import CodeSnippet from "../CodeSnippet";
import axios from "axios";
import Spinner from "../Spinner";

const Step3Screen = () => {
  const [proofResponse, setProofResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleProofClick = async () => {
    setIsLoading(true);
    const responseOnnxFile = await axios.post("/api/readOnnxFile");
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
      onnx_file_data: responseOnnxFile.data.base64,
    };

    try {
      const response = await axios.post("/api/prove", {
        onixSendData,
      });
      const data = await response.data;
      setProofResponse(JSON.stringify(data, null, 2));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching proof:", error);
      setProofResponse("Error fetching proof");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[70vh] w-full gap-10 flex-col items-center justify-between py-10">
      <div className="w-full flex flex-col items-center">
        <h2 className="text-xl font-bold text-white mb-4">
          Zero Knowledge Proof
        </h2>
        <button
          onClick={() => handleProofClick()}
          className={
            "flex bg-gradient-to-r justify-center from-green-300 via-blue-500 to-purple-600 text-white font-[600] uppercase rounded-[12px] p-3 w-[200px]"
          }
        >
          {isLoading ? <Spinner /> : "PROVE"}
        </button>
        {proofResponse && <CodeSnippet code={proofResponse} />}
      </div>
    </div>
  );
};

export default Step3Screen;
