/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // target: "serverless",
  images: {
    domains: [
      "localhost",
      "lh3.googleusercontent.com",
      "github.com",
      "raw.githubusercontent.com",
    ],
  },
};
