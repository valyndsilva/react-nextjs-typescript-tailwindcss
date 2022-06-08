/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  exportTrailingSlash: true,
  // target: "serverless",
  images: {
    domains: [
      "cdn.sanity.io",
      "<http://cd.sanity.io|cd.sanity.io>",
      "localhost",
      "lh3.googleusercontent.com",
      "github.com",
      "raw.githubusercontent.com",
      "avatars.githubusercontent.com",
      "sanity-twitter-clone.netlify.app/",
      "react-nextjs-typescript-tailwindcss-twitter-clone.vercel.app/",
    ],
  },
};
