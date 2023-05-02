// pages/api/getOnnxAsBase64.ts

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Read the ONNX file as a Buffer
    const onnxFilePath = path.join(
      process.cwd(),
      "contracts",
      "network.onnx"
    );
    const onnxBuffer = await fs.promises.readFile(onnxFilePath);

    // Convert the Buffer to a base64-encoded string
    const base64 = onnxBuffer.toString("base64");

    // Send the base64-encoded ONNX file as a JSON response
    res.status(200).json({ base64 });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({
        message: "An error occurred while reading the ONNX file.",
      });
  }
}
