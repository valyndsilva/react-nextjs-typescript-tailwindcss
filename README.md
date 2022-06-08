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
npm run dev
npm install @heroicons/react
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
npm install react-twitter-embed
```

### Install Sanity Studio:

```
npm install -g @sanity/cli
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
npm install next-sanity @portabletext/react @sanity/image-url

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
npm run dev
```

## Implementing Server-Side Rendering:

React loads the entire bundle on the users browser which takes long. Therefore SSR is recommended.
In SSR all the JS is handled on the server and the user gets the output of the response.
NextJS gives us API endpoints out of the box.
We will create an endpoint for fetching tweets and then fetch from our own server.
Instead of contacting sanity directly from our browser we will create npm endpoints and connect to these endpoints which then on our server makes communication to sanity. This is also a safer alternative.

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
npm install --dev next-sanity

Next create a new API endpoint in pages/api folder and called getTweets.ts

```
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
```

npm install --save groq

```
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
npm run dev
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
npm install react-timeago
npm install --dev @types/react-timeago

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
Update Tweet.tsx and Feed.tsx

Next install react-hot-toast (https://react-hot-toast.com/)

```
npm install react-hot-toast
```

In index.tsx

```
import { Toaster } from 'react-hot-toast';
Place <Toaster/> component after Head component
```

In Feed.tsx implement the toast :

```
import toast from 'react-hot-toast';

In the handleRefresh:
  const handleRefresh = async () => {
    const refreshToast = toast.loading('Refreshing...');
    const tweets = await fetchTweets();
    setTweets(tweets);
    toast.success('Feed Updated!', {
      id: refreshToast,
    });
  };
```

## Implemnt Twitter Login using NextAuth:

```
npm install next-auth
```

### Add API route

To add NextAuth.js to the project create a file called [...nextauth].js in pages/api/auth.
Copy the example and get onfrom there.(https://next-auth.js.org/getting-started/example)

### Configure Shared session state:

Open pages/\_app.tsx:
Wrap <SessionProvider  session={session}></SessionProvider>, at the top level of your application around <Component {...pageProps} /> and destructure pageProps: { session, ...pageProps },

### Frontend - Add React Hook:

The useSession() React Hook in the NextAuth.js client is the easiest way to check if someone is signed in.
You can use the useSession hook from anywhere in your application (e.g. in a header component).

Open Sidebar.tsx and update.

```
import { useSession, signIn, signOut } from "next-auth/react"

function Sidebar() {
  const { data: session } = useSession();

  return (
...
 <SidebarRow
        onClick={session ? signOut : signIn}
        Icon={UserIcon}
        title={session ? 'Sign Out' : 'Sign In'}
      />
)

```

Open .env.local and add NEXT_AUTH_SECRET and NEXTAUTH_URL (very important step):

```
NEXTAUTH_SECRET=value you can define (go to https://generate-secret.now.sh/32)
NEXTAUTH_URL=value same as NEXT_PUBLIC_BASE_URL (this should be changed to the url after deployment)
```

### Create a Twitter OAuth app:

Go to Twitter Developer platform and sign up/login.
Add App name: sanity-twitter-clone
Save the API Key, API Key Secret and Bearer Token somewhere safe as you won't be able to see it again.
Next, Go to the dashboard => Project & Apps => sanity-twitter-clone
Under "User authentication settings" => Set up => Enable OAuth 2.0
Type of App: Single page App
Callback URI / Redirect URL: http://localhost:3000/api/auth/callback/twitter (this will change to your deployed URL)
Website URL: http://test.com (this will change to your deployed URL)
Save
Save the Client ID and Client Secret in a safe place.

Open .env.local file and add:

```
TWITTER_CLIENT_ID=value
TWITTER_CLIENT_SECRET=value
```

Restart next dev server in root directory evrytime changes are made to the .env.local file:
npm run dev

### Create a Github OAuth app:

To get Github Client ID and Secret Login to Github:
Settings => Developer Settings => OAuth Apps => New OAuth App
App Name: NextAuth Twitter Integration App
Homepage URL: https://localhost:3000 (this will change to your deployed URL)
Authorization callback URL: http://localhost:3000/api/auth/callback/github (this will change to your deployed URL)
Register Application => Generate the Client Secret.
Open .env.local file and add:

```
GITHUB_CLIENT_ID=value
GITHUB_CLIENT_SECRET=value
```

Restart next dev server in root directory evrytime changes are made to the .env.local file:
npm run dev

### Create a Google OAuth app:

To allow users to log in to our app using their Google account, we have to obtain OAuth 2.0 client credentials from the [Google API Console] (https://console.developers.google.com/).
First you need to create the OAuth Consent screen:
App name: NextAuth Twitter Integration
User support email: valyndsilva@gmail.com
App logo: Leave empty
App home page: http://localhost:3000 (this will change to your deployed URL)
Authorized domain 1: test.com (this will change to your deployed URL)
Email addresses: valyndsilva@gmail.com

Next, navigate to Credentials => Create credentials => OAuth client ID
Choose an Application Type: Select Web Application
Name: This is the name of your application
Authorized JavaScript origins: This is the full URL to the homepage of our app. Since we are still in development mode, we are going to fill in the full URL our development server is running on. In this case, it is http://localhost:3000
Authorized redirect URIs: Users will be redirected to this path after they have authenticated with Google: http://localhost:3000/api/auth/callback/google
Next, a popup will display your client ID and client secret. Copy and add them o your env.local file:

```
GOOGLE_CLIENT_ID=value
GOOGLE_CLIENT_SECRET=value
```

Restart next dev server in root directory evrytime changes are made to the .env.local file:
npm run dev

Now open TweetBox.tsx:
Here we can use the users info after sign in to Google, Github or Twitter. Also, we can disable the tweet button if there is no input or there is no session (logged out)

```
import { useSession } from 'next-auth/react';

function TweetBox() {
  ...
const { data: session } = useSession();
  // console.log(session);
  // console.log(session?.user?.image);
  return(
...
 <button
      disabled={!input || !session}
      className="bg-twitter rounded-full px-5 py-2 font-bold text-white disabled:opacity-40"
      >
              Tweet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TweetBox;


```

## Image URL Functionality for TweetBox.tsx:

```
  const [image, setImage] = useState<string>('');
  const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const addImageToTweet = (
    e: React.MouseEvent<HTMLButtonElement,  globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    // if no image assigned  don't attach an image
    if (!imageInputRef.current?.value) return;
    if (imageInputRef.current) {
      setImage(imageInputRef.current.value);
      imageInputRef.current.value = ''; //clear the input
      setImageUrlBoxIsOpen(false);
    }
  };


return (
...
<PhotographIcon
onClick={() => setImageUrlBoxIsOpen(!imageUrlBoxIsOpen)}
className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150"
/>
...
           <button
              disabled={!input || !session}
              className="bg-twitter rounded-full px-5 py-2 font-bold text-white disabled:opacity-40"
            >
              Tweet
            </button>
          </div>
          {imageUrlBoxIsOpen && (
            <form className="mt-5 flex rounded-lg bg-twitter/80 py-2 px-4">
              <input
                ref={imageInputRef}
                className="flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white"
                type="text"
                placeholder="Enter Image URL..."
              />
              <button
                type="submit"
                onClick={addImageToTweet}
                className="font-bold text-white"
              >
                Add Image
              </button>
            </form>
          )}
          {image && (
            <img
              src={image}
              className="mt-10 h-40 w-full rounded-xl object-contain shadow-lg"
              alt=""
            />
          )}
        </form>
      </div>
    </div>
  );
}

export default TweetBox;

```

### To Add a Tweet:

Create an endpoint addTweet.tsx in api folder:

```
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { TweetBody } from '../../typings';
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
          _type: 'tweet',
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
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
    },
    body: JSON.stringify(mutations),
    method: 'POST',
  });
  const json = await result.json();
  res.status(200).json({ message: 'Tweet Added' });
}
```

Next, open TweetBox.tsx to use the addTweet functionality:

```
    const postTweet = async () => {
    const tweetInfo: TweetBody = {
      text: input,
      username: session?.user?.name || 'Unkown user',
      profileImage: session?.user?.image || '/avatar-icon.jpeg',
      image: image,
    };
    const result = await fetch('/api/addTweet', {
      body: JSON.stringify(tweetInfo), // strigify the JS object to be sent
      method: 'POST',
    });
    const data = await result.json();
    const newTweets = await fetchTweets();
    setTweets(newTweets);

    toast('Tweet Posted!', {
      icon: '🚀',
    });
    return data;
  };
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    postTweet();
    setInput('');
    setImage('');
    setImageUrlBoxIsOpen(false);
  };

  return (
    ...
      <button
              onClick={handleSubmit}
              disabled={!input || !session}
              className="bg-twitter rounded-full px-5 py-2 font-bold text-white disabled:opacity-40"
            >
              Tweet
            </button>
            ...
  )

}

export default TweetBox;
```

Test the TweetBox. It should work :)

Bascially when you click on Tweet it sends the POST request information in a req.body which mutates the Sanity platform backend and adds in the new document i.e the new Tweet. Next, we refetch the documents and see a re-render

To hide the scrollbar in Feed:
(https://www.npmjs.com/package/tailwind-scrollbar-hide)

```
npm install tailwind-scrollbar-hide
```

Next,open tailwind.config.js:
plugins: [require('tailwind-scrollbar-hide')],

Add className="scrollbar-hide" to implement it.

## Implement Add Comment Functionality:

Create addComment.ts in api folder:

```
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { CommentBody } from '../../typings';
type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data: CommentBody = JSON.parse(req.body);
  console.log(data.tweetId);

  // mutations sends instruction to the backend and tells the backend how to update the data
  // https://www.sanity.io/docs/http-mutations
  const mutations = {
    mutations: [
      {
        create: {
          _type: 'comment',
          comment: data.comment,
          username: data.username,
          profileImage: data.profileImage,
          tweet: {
            _type: 'reference',
            _ref: data.tweetId,
          },
        },
      },
    ],
  };
  const apiEndpoint = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`;
  const result = await fetch(apiEndpoint, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
    },
    body: JSON.stringify(mutations),
    method: 'POST',
  });
  const json = await result.json();
  res.status(200).json({ message: 'Comment Added' });
}

```

Open Tweet.tsx:

```
import { useSession } from 'next-auth/react';

const [commentBoxVisible, setCommentBoxVisible] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  ....

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const commentToast = toast.loading('Posting Comment...');

    // Make a REST API call to backend - Comment Logic
    const commentInfo: CommentBody = {
      comment: input,
      tweetId: tweet._id,
      username: session?.user?.name || 'Unknown User',
      profileImage: session?.user?.image || '/avatar-icon.jpeg',
    };
    const result = await fetch('/api/addComment', {
      body: JSON.stringify(commentInfo), // strigify the JS object to be sent
      method: 'POST',
    });
    const data = await result.json();
    console.log(result);
    toast.success('Comment Posted!', {
      id: commentToast,
    });

    setInput('');
    setCommentBoxVisible(false);
    refreshComments();
  };

  return(
    ...
      <div
          onClick={() => session && setCommentBoxVisible(!commentBoxVisible)}
          className="flex cursor-pointer items-center space-x-3 text-gray-400"
        >
          <ChatAlt2Icon className="h-5 w-5" />
          <p>{comments.length}</p>
        </div>

        ...
     {/* Comment Box Logic */}
      {commentBoxVisible && (
        <form onSubmit={handleSubmit} className="mt-3 flex space-x-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="flex-1 rounded-lg bg-gray-100 p-2 outline-none"
            placeholder="Write a comment..."
          />
          <button
          type="submit"
            className="text-twitter disabled:text-gray-200"
            disabled={!input}
           // onClick={handleSubmit}
          >
            Post
          </button>
        </form>
      )}
      .....
  );
}

export default Tweet;
```

## Cross check that all variabled are included in.env.local

NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_BASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=

### Deploy the sanity studio online so it can be accessed from anywhere:

```
cd sanity-studio
sanity deploy
```

Give a studio hostname: twitter-sanity-clone
It's deployed to: https://twitter-sanity-clone.sanity.studio/

### Deploy the NextJS app to github and trigger vercel deploy hooks:

Open .gitignore and add:

```
sanity-studio/node_modules
sanity-studio/dist
sanity-studio/coverage
sanity-studio/logs
sanity-studio/\*.log
```

Next push updates to github:

```
git add .
git commit -m "comment"
git push -u origin main
```

Next, trigger vercel deploy hooks from your sanity studio folder: sanity-studio

```
sanity install vercel-deploy
sanity install @sanity/dashboard
```

### Deploying Sanity Studio with Vercel:

Next, go to https://vercel.com/guides/deploying-sanity-studio-with-vercel

#### Step 1: Setting Up your Sanity Studio Project

Note: You can skip this step if you already have a project set up.

```
npm install @sanity/cli
sanity init (To initiate a new project and download the Studio code to your computer)
Your project name: project-name
default config?: y
project output path: studio
project template schema: Blog schema
Open sanity.io/manage and copy the projectId: and dataset:production into .env.local
cd into the project studio folder: sanity start (To start a local development server, cd into the project folder)
```

#### Step 2: Preparing for Deployment

To provide Vercel with routing information for the app, add a "vercel.json" file with the following content in the root directory studio:

```
{
"version": 2,
"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Add the following scripts to the Studio’s package.json file i.e sanity-studio folder:

```
{
...
"scripts": {
"start": "sanity start",
"test": "sanity check",
"build": "sanity build public -y"
}
}
```

Lastly, add @sanity/cli as a development dependency, this will allow Vercel to build your project on deployment.
After saving your package.json file you will be ready to deploy your project.

```
npm i --save-dev @sanity/cli
```

#### Step 3: Deploy With Vercel

When using the Vercel CLI to deploy make sure you add a .vercelignore that includes files that should not be uploaded, generally these are the same files included in .gitignore.

- Open, vercel.com/dashboard, New Project -> Import Git Repository
- Select the repo root directory: studio
- Select framework: Next.js
- Add the Environment Variables frrom .env.local
- Deploy

#### Step 4: Adding CORS credentials to your Sanity project.

##### Via the command line interface:

Once Sanity Studio is deployed, you will need to add it's URL to Sanity’s CORS origins settings. You can do this from the command line:

```
sanity cors add https://your-url.vercel.app --credentials
```

You can confirm your origin was added with the statement CORS origin added successfully or by consulting the list returned by the command sanity cors list.

OR

##### Via your management console:

To add a CORS origin from your management console:

- Go to https://www.sanity.io/manage
- Pick your project from the list
- Go to Settings, and then to API settings
- Under CORS Origins, click the Add CORS origin button
- Enter your Origin, select whether or not to Allow credentials, and click Save.
- If your origin was added successfully, it will appear at the top of your CORS origins list.

ESLint Configuration Setup for NextJS:

```
npm run next lint
```

To remove incorrect peer dependency errors:

```
npm upgrade
```

## Deploying Next.JS App on Netlify:

Steps: https://www.netlify.com/blog/2021/05/04/migrating-an-existing-next.js-project-to-netlify/
To enable server-side rendering and other framework-specific features in your builds install Essential Next Plugin by netlify or manually install it with the command below: (https://github.com/netlify/netlify-plugin-nextjs)

```
npm install @netlify/plugin-nextjs
```

Next, Create a netlify.toml file and include the script below:

```
[build]
command = "npm run build"
publish = ".next"

[[plugins]]
package = "@netlify/plugin-nextjs"
```

Deploy Settings:
Build command: npm run build

Deploy. :slightly_smiling_face:
