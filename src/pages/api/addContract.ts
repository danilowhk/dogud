import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createServerSupabaseClient({ req, res });

  try {
    const { content } = req.body;
    const response = await supabase.from("contracts").insert({
      content: content,
    });

    console.log("DB", response);

    res.status(200).send("Created a Contract in SB");
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json({ statusCode: 500, message: err });
  }
};

export default handler;
