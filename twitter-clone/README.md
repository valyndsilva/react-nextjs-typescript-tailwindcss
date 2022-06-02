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
yarn add react-twitter-embed
