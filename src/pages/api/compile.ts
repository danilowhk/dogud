// pages/api/compile.ts
import { NextApiRequest, NextApiResponse } from "next";
import solc from "solc";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { contractSource } = req.body;

  if (!contractSource) {
    res.status(400).json({ message: "Contract source is required" });
    return;
  }

  try {
    const input = {
      language: "Solidity",
      sources: {
        "ContractEZKL.sol": {
          content: contractSource,
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
      },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors && output.errors.length > 0) {
      res.status(400).json({
        message: "Compilation failed",
        errors: output.errors,
      });
      return;
    }

    const contractJSON = output.contracts["ContractEZKL.sol"];

    res.status(200).json({ contractJSON });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
