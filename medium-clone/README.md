# Meduim Clone

[Preview](https://react-nextjs-typescript-tailwindcss-medium-clone.vercel.app/)

## Tech Stack Used:

- React
- TypeScript
- NextJS
- Tailwind CSS
- Sanity CMS
- GROQ

## Scripts used:

```
npx create-next-app --example with-tailwindcss medium-clone
npm install -g @sanity/cli
sanity init --coupon sonny2022
npm run dev
```

## Implementation

### To run the sanity studio locally, run the following command:

```
cd sanity-medium-clone
sanity-login
sanity start (This runs the local sanity studio)
```

- Go to http://localhost:3333
- Select Desk tab and you can see the different schemas available
- Create a few posts in the Desk tab

### To add a custom field open sanity-medium-clone/schemas/post.js and add:

```
{
name: 'description',
title: 'Description',
type: 'string',
},
```

You can see the updated fields.

### Open Vision tab. Here you can use GROQ to query the schema.

Ex:

```
*[_type == "post"]{
_id,
title,
slug,
author -> {
name,
image
},
description,
mainImage
}
```

Click on Fetch button to see the result.

Open the Terminal:

```
cd medium-clone
npm install next-sanity
npm install @sanity/image-url
```

Next, install ESLint using npm:

```
npm install eslint --save-dev
```

You should then set up a configuration file:

```
npm init @eslint/config
```

### Create a new file in the root folder called .env.local

Open sanity.json and copy the dataset and projectId values into the .env.local

Ex:

```
NEXT_PUBLIC_SANITY_DATASET=dataset-value
NEXT_PUBLIC_SANITY_PROJECT_ID=projectId-value
SANITY_API_TOKEN=value
```

### Next, create a new folder in the root folder called "lib" and 2 files in it:

sanity.js and config.js

Open config.js:

```
- export const config = {
/**
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
  **/
  useCdn: process.env.NODE_ENV === 'production',
  }
```

Next, Open sanity.js:

```
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
```

On the Homepage (index.tsx) page we implement Server Side Rendering: So anytime someone visits the homepage it renders per request.
Basically it means the page is built on the server (next.js) per request and delivers the page to the client side ready.

### Implementing SSR (index.tsx)

```
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
```

### Create a new file for type definitions called "typings.d.ts" in the root folder:

```
export interface Post {
// Refer to sanity query result to get the properties of the post
_id: string
_createdAt: string
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
```

In index.tsx add the following:

```
interface Props {
posts: [Post] // importing Post from typings.d.ts
}
```

### ISR Incremental Static Regeneration:

- It helps to pre-build the dynamic pages detemined by the slug.
- Static pages are cached which is combined with refreshing the page every 60 seconds so the cache is never stale for the period you define.
- Let's create a page that lives on /post/slug
- Create inside the pages folder a folder called post and in post a file [slug].tsx
- Create the getStaticPaths and getStaticProps in [slug].tsx
- getStaticProps should have revalidate to make sure to autorefresh after the time specified.

### Next, in medium-clone folder install React-Portable-Text:

```
npm install react-portable-text
npm install react-hook-form (https://react-hook-form.com/)
```

### Create a new file createComment.ts in api folder.

In medium-clone folder:

```
npm install @sanity/client
```

To get the SANITY_API_TOKEN:

- Open sanity.io dashboard -> API -> Tokens -> Add API Token -> Give a name and select Editor option -> Save.
- Open .env.local and add the SANITY_API_TOKEN to the file.

### To check your comments that are submitted in the sanity studio and add the comment schema.

- Go to sanity-medium-clone -> schemas -> create comment.js:

```
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
```

#### In schema.js:

```
import comment from './comment' and add comment in schemaTypes.concat
```

### Add the interface definitions for comment in typings.d.ts:

```
export interface Comment {
approved: boolean;
comment: string;
email: string;
name: string;
post: {
_ref: string;
_type: string;
};
_createdAt: string;
_id: string;
_rev: string;
_type: string;
_updatedAt: string;
}
```

## Cross check that all variabled are included in.env.local

NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=

### Deploy the sanity studio online so it can be accessed from anywhere:

```
cd sanity-medium-clone
sanity deploy
```

Give a studio hostname: sanity-studio-medium-clone
It's deployed to: https://sanity-studio-medium-clone.sanity.studio/

### Deploy the NextJS app to github and trigger vercel deploy hooks:

Open .gitignore and add:

```
sanity-medium-clone/node_modules
sanity-medium-clone/dist
sanity-medium-clone/coverage
sanity-medium-clone/logs
sanity-medium-clone/\*.log
```

Next push updates to github:

```
git add .
git commit -m "comment"
git push -u origin main
```

Next, trigger vercel deploy hooks from your sanity studio folder: sanity-medium-clone

```
sanity install vercel-deploy
sanity install @sanity/dashboard
```

### Deploying Sanity Studio with Vercel:

Next, go to https://vercel.com/guides/deploying-sanity-studio-with-vercel

#### Step 1: Setting Up your Sanity Studio Project

Note: You can skip this step if you already have a project set up.

```
npm i -g @sanity/cli
sanity init (To initiate a new project and download the Studio code to your computer)
sanity start (To start a local development server, cd into the project folder)
```

#### Step 2: Preparing for Deployment

To provide Vercel with routing information for the app, add a "vercel.json" file with the following content in the root directory medium-clone:

```
{
"version": 2,
"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Add the following scripts to the Studio’s package.json file i.e sanity-medium-clone folder:

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

- Open, vercel.com/dashboard, New Project -> Import Git Repository
- Select the repo root directory: medium-clone
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
