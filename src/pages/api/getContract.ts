import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createServerSupabaseClient({ req, res });

  try {
    const allContracts = await supabase.from("contracts").select("*");

    res.status(200).send(allContracts.data);
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json({ statusCode: 500, message: err });
  }
};

export default handler;
