// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { TweetBody } from "../../typings";
type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data: TweetBody = JSON.parse(req.body);
  // mutations sends instruction to the backend and tells the backend how to update the data
  // https://www.sanity.io/docs/http-mutations
  const mutations = {
    mutations: [
      {
        create: {
          _type: "tweet",
          text: data.text,
          username: data.username,
          blockTweet: false,
          profileImage: data.profileImage,
          image: data.image,
        },
      },
    ],
  };
  const apiEndpoint = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`;
  const result = await fetch(apiEndpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
    },
    body: JSON.stringify(mutations),
    method: "POST",
  });
  const json = await result.json();
  res.status(200).json({ message: "Tweet Added" });
}
