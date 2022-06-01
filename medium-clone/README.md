# Meduim Clone

## Tech Stack Used:

React
TypeScript
NextJS
Tailwind CSS
Sanity CMS
GROQ

## Scripts used:

npx create-next-app --example with-tailwindcss medium-clone
npm install -g @sanity/cli
sanity init --coupon sonny2022
npm run dev

To run the sanity studio locally, run the following command:
cd sanity-medium-clone
sanity-login
sanity start (This runs the local sanity studio)
Go to http://localhost:3333
Select Desk tab and you can see the different schemas available
Create a few posts in the Desk tab
To add a custom field open sanity-medium-clone/schemas/post.js and add:
{
name: 'description',
title: 'Description',
type: 'string',
},
You can see the updated fields.

Open Vision tab. Here you can use GROQ to query the schema.

Ex: \*[_type == "post"]{
\_id,
title,
slug,
author -> {
name,
image
},
description,
mainImage
}

Click on Fetch button to see the result.

Open the Terminal:
cd medium-clone
npm install next-sanity
npm install @sanity/image-url

Create a new file in the root folder called .env.local
Open sanity.json and copy the dataset and projectId values into the .env.local
Ex:
NEXT_PUBLIC_SANITY_DATASET=dataset-value
NEXT_PUBLIC_SANITY_PROJECT_ID=projectId-value

Next, create a new folder in the root folder called lib and 2 files in it:
sanity.js and config.js

Open config.js:

export const config = {
/\*\*

- Find your project ID and dataset in `sanity.json` in your studio project.
- These are considered “public”, but you can use environment variables
- if you want differ between local dev and production.
-
- https://nextjs.org/docs/basic-features/environment-variables
  **/
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: '2022-05-31', // or today's date for latest
  /**
- Set useCdn to `false` if your application require the freshest possible
- data always (potentially slightly slower and a bit more expensive).
- Authenticated request (like preview) will always bypass the CDN
  \*\*/
  useCdn: process.env.NODE_ENV === 'production',
  }

Next, Open sanity.js:
import { createCurrentUserHook, createClient } from 'next-sanity'
import createImageUrlBuilder from '@sanity/image-url'
import { config } from './config'

if (!config.projectId) {
throw Error('The Project ID is not set. Check your environment variables.')
}

// Set up client for fetching data in the getProps page functions
export const sanityClient = createClient(config)

// Set up a helper function for generating Image URLs (extracting URL from the image) with only the asset reference data in your documents. Read more: https://www.sanity.io/docs/image-url
export const urlFor = (source) => createImageUrlBuilder(config).image(source)

// Helper function for using the current logged in user account
export const useCurrentUser = createCurrentUserHook(config)

On the Homepage (index.tsx) page we implement Server Side Rendering: So anytime someone visits the homepage it renders per request.
Basically it means the page is built on the server (next.js) per request and delivers the page to the client side ready.

// Implementing SSR (index.tsx)
export const getServerSideProps = async () => {
//This is where the server pre-builds the pages
// It changes the homepage route to SSR route
const query = `*[_type == "post"]{ _id, title, slug, author -> { name, image }, description, mainImage }`

const posts = await sanityClient.fetch(query)
return {
props: {
posts,
},
}
}

Create a new file for type definitions called typings.d.ts in the root folder:
export interface Post {
// Refer to sanity query result to get the properties of the post
\_id: string
\_createdAt: string
title: string
author: {
name: string
image: string
}
description: string
mainImage: { asset: { url: string } }
slug: {
current: string
}
body: [object]
}

In index.tsx add the following:
interface Props {
posts: [Post] // importing Post from typings.d.ts  
}

ISR Incremental Static Regeneration:
It helps to pre-build the dynamic pages detemined by the slug.
Static pages are cached which is combined with refreshing the page every 60 seconds so the cache is never stale for the period you define.
Let's create a page that lives on /post/slug
Create inside the pages folder a folder called post and in post a file [slug].tsx
Create the getStaticPaths and getStaticProps in [slug].tsx

Next, in medium-clone folder:
npm install react-portable-text
npm install react-hook-form (https://react-hook-form.com/)

Create a new file createComment.ts in api folder.
In medium-clone folder: npm install @sanity/client
To get the SANITY_API_TOKEN:
Open sanity.io dashboard -> API -> Tokens -> Add API Token -> Give a name and select Editor option -> Save.
Open .env.local and add the SANITY_API_TOKEN to the file.

To check your comments that are submitted in the sanity studio add the comment schema.
Go to sanity-medium-clone -> schemas -> create comment.js:
export default {
name: 'comment',
title: 'Comment',
type: 'document',
fields: [
{
name: 'name',
type: 'string',
},
{
name: 'approved',
title: 'Approved',
type: 'boolean',
description: "Comments won't show on the site without approval",
},
{
name: 'email',
type: 'string',
},
{
name: 'comment',
type: 'text',
},
{
name: 'post',
type: 'reference',
to: [
{
type: 'post',
},
],
},
],
};

In schema.js:
import comment from './comment' and add comment in schemaTypes.concat

Add the interface def for comment in typings.d.ts:
export interface Comment {
approved: boolean;
comment: string;
email: string;
name: string;
post: {
\_\_ref: string;
\_type: string;
};
\_createdAt: string;
\_id: string;
\_rev: string;
\_type: string;
\_updatedAt: string;
}

Deploy the sanity studio online so it can be accessed from anywhere:
cd sanity-medium-clone
sanity deploy
Give a studio hostname: sanity-studio-medium-clone
It's deployed to: https://sanity-studio-medium-clone.sanity.studio/

Next, we need to deploy the NextJS app to github:
Open .gitignore and add:
sanity-medium-clone/node_modules
sanity-medium-clone/dist
sanity-medium-clone/coverage
sanity-medium-clone/logs
sanity-medium-clone/\*.log

Next open github and create a new repo. Ex: sanity-medium-clone-deploy
Copy paste the remote add origin link: Ex: git remote add origin https://github.com/valyndsilva/sanity-medium-clone-deploy.git
Open Terminal in sanity-medium-clone folder.
git add .
git commit -m "comment"
git push -u origin main

Next, go to vercel.com/dashboard
New Project
Import Git Repository
select the repo root directory: medium-clone/sanity-medium-clone
Build and output settings:
Build command: npm start
Install command: npm install
Add the Environment Variables frrom .env.local
Deploy

