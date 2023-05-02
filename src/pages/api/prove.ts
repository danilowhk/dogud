// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import fs from "fs";
import path from "path";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const filePath = path.join(
      process.cwd(),
      "./contracts/network.onnx"
    );
    const fileContent = fs.readFileSync(filePath, "utf8");

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
      onnx_file_data: fileContent,
    };

    const response = await axios.post(
      "https://ezkl-framework-server.herokuapp.com/prove",
      onixSendData
    );

    res.status(200).json(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      // The request was made, and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error status:", axiosError.response.status);
      console.error("Error data:", axiosError.response.data);
      res
        .status(axiosError.response.status)
        .json({ error: axiosError.response.data });
    } else if (axiosError.request) {
      // The request was made, but no response was received
      console.error("Error request:", axiosError.request);
      res
        .status(500)
        .json({ error: "No response received from the server." });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", axiosError.message);
      res.status(500).json({ error: axiosError.message });
    }
  }
};

export default handler;
