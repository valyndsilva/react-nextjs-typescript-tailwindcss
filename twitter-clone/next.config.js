/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // target: "serverless",
  images: {
    domains: [
      "cdn.sanity.io",
      "<http://cd.sanity.io|cd.sanity.io>",
      // "localhost",
      // "lh3.googleusercontent.com",
      // "github.com",
      // "raw.githubusercontent.com",
    ],
  },
};
