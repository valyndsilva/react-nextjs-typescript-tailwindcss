# Twitter Clone:

## Tech Stack Used:

- React
- Next.js
- Tailwind CSS
- TypeScript
- Server Side Rendering
- Sanity CMS
- NextAuth
- Hero icons

## Scripts Used:

[Read more:](https://v2.tailwindcss.com/docs/guides/nextjs)

```
npx create-next-app -e with-tailwindcss twitter-clone
cd twitter-clone
yarn run dev
yarn add @heroicons/react
```

Create components folder in root directory and create Sidebar.js and SidebarRow.js.

In tailwind.config.js add the twitter hex color to use in SidebarRow.js:

```
 extend: {
      colors: {
        twitter: '#00ADED',
      },
    },
```

For the widgets we use react-twitter-embed library: (https://www.npmjs.com/package/react-twitter-embed)

```
yarn add react-twitter-embed
```

### Install Sanity Studio:

```
yarn global add @sanity/cli
sanity login
sanity init --coupon sonny2022
Create dataset: Yes
Project output path: sanity-studio
Select project template: Blog (schema)
cd sanity-studio
sanity start
```

Edit schemas folder in sanity-studio:
Create tweet.js and comment.js.

### Next setup Sanity.io toolkit for Next.js: (https://github.com/sanity-io/next-sanity)

In sanity-studio folder:
yarn add next-sanity @portabletext/react @sanity/image-url

Next, create a folder called lib in root directory and 2 files in it called config.js and sanity.js.

In lib/config.js:

```
export const config = {
  /**
   * Find your project ID and dataset in `sanity.json` in your studio project.
   * These are considered “public”, but you can use environment variables
   * if you want differ between local dev and production.
   *
   * https://nextjs.org/docs/basic-features/environment-variables
   **/
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: '2022-05-31', // or today's date for latest
  /**
   * Set useCdn to `false` if your application require the freshest possible
   * data always (potentially slightly slower and a bit more expensive).
   * Authenticated request (like preview) will always bypass the CDN
   **/
  useCdn: process.env.NODE_ENV === 'production',
};

```

In lib/sanity.js

```
import { createClient } from 'next-sanity';
import { config } from './config';

if (!config.projectId) {
  throw Error('The Project ID is not set. Check your environment variables.');
}

// Set up client for fetching data in the getProps page functions
export const sanityClient = createClient(config);

```

Create a file called .env.local in the root of your project.

```
NEXT_PUBLIC_SANITY_DATASET=value
NEXT_PUBLIC_SANITY_PROJECT_ID=value
SANITY_API_TOKEN=value
```

Open sanity.io/manage:

```
Click on Datasets to get the NEXT_PUBLIC_SANITY_DATASET value
Copy Project Id and paste into NEXT_PUBLIC_SANITY_PROJECT_ID
Settings => API settings => Tokens => Create Tokens
Name: twitter-clone
Permissions Option: Editor
Create Token.
Copy the token value and paste into SANITY_API_TOKEN in env.local
```

After updating the .env.local restart in root directory:

```
yarn run dev
```

## Implementing Server-Side Rendering:

React loads the entire bundle on the users browser which takes long. Therefore SSR is recommended.
In SSR all the JS is handled on the server and the user gets the output of the response.
NextJS gives us API endpoints out of the box.
We will create an endpoint for fetching tweets and then fetch from our own server.
Instead of contacting sanity directly from our browser we will create yarn endpoints and connect to these endpoints which then on our server makes communication to sanity. This is also a safer alternative.

Open pages/index.tsx and add the special function called getServerSideProps
Create a new folder called utils in root directory and a file called fetchTweets.tsx

Create a custom type by creating a typings.d.ts in the root directory:

```
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
```

Install a package in the root directory folder:
yarn add --dev next-sanity

Next create a new API endpoint in pages/api folder and called getTweets.ts

```
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../lib/sanity';
import { Tweet } from '../../typings';
import { groq } from 'next-sanity';

const feedQuery = groq`
*[_type == "tweet" && !blockTweet]{
  _id,
...
} | order(_createdAt desc)
`;

type Data = {
  tweets: Tweet[];
};

//Make a fetch to the backend on sanity to get tweets. Here we use GROQ to query on sanity CMS
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const tweets: Tweet[] = await sanityClient.fetch(feedQuery);
  console.log(tweets);

  res.status(200).json({ tweets });
}

```

Open .env.local and add:

```
NEXT_PUBLIC_BASE_URL=value (this will be localhost or url we deploy to)
```

Restart server in root folder:

```
yarn run dev
```

Next open utils/fetchTweets.ts:

```
import { Tweet } from '../typings';

export const fetchTweets = async () => {
  // Make a REST API call to backend
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getTweets`);
  const data = await res.json();
  const tweets: Tweet[] = data.tweets;
  return tweets;
};

```

Open index.tsx, add Props interface update getServerSideProps:

```
interface Props {
  tweets: Tweet[];
}
const Home = ({ tweets }: Props) => {
    ...
    }
export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  //This is where the server pre-builds/pre-fetches the pages
  // Here all the information that is needed to pre-fetch is passed as the props to the component
  // It changes the homepage route to SSR route
  const tweets = await fetchTweets();
  return {
    props: {
      tweets,
    },
  };
};
```

Import react-timeago into root directory
yarn add react-timeago
yarn add --dev @types/react-timeago

Create a new component called Tweet.tsx.
Import it in Feed.tsx as TweetComponent to avoid clash with Tweet typings:
import TweetComponent from '../components/Tweet';

Update the typings.d.ts with type CommentBody and interface Comment:

```
export type CommentBody = {
  text: string;
  username: string;
  profileImage: string;
  image?: string;
};

export interface Comment extends CommentBody {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: string;
  tweet: {
    _ref: string;
    _type: 'reference';
  };
}
```

Next create a new file api/getComments.ts and utils/fetchComments.tsx
