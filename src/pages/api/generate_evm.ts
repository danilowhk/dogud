// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const supabase = createServerSupabaseClient({ req, res });
  try {
    const { onixSendData } = req.body;

    const response = await axios.post(
      "https://ezkl-framework-server.herokuapp.com/generate_evm_contract",
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
