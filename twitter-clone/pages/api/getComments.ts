// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { groq } from 'next-sanity';
import { sanityClient } from '../../lib/sanity';
import { Comment } from '../../typings';

const commentQuery = groq`
*[_type == "comment" 
  && references(*[_type == 'tweet' && _id == $tweetId]._id)]{
  _id,
...
} | order(_createdAt desc)
`;
type Data = Comment[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { tweetId } = req.query; // req.query contains the URL query parameters (after the ? in the URL). It is in a key-value format.
  const comments: Comment[] = await sanityClient.fetch(commentQuery, {
    tweetId,
  });
  console.log(req.query);

  console.log(comments);
  res.status(200).json(comments);
}
