// Create your type definitions here.
// When we get our tweet back from sanity we get a bunch of other info which is not needed.
// We can format it the way we need:

// from schemas/tweet.js
export type TweetBody = {
  text: string;
  username: string;
  profileImage: string;
  image?: string;
};

export interface Tweet extends TweetBody {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: string;
  blockTweet: boolean;
}
