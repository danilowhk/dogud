// pages/api/readSolidityFile.ts
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "./contracts/ContractEZKL.sol"
    );
    const fileContent = fs.readFileSync(filePath, "utf8");

    res.status(200).json({ contractSource: fileContent });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
