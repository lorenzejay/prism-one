/** @type {import('next').NextConfig} */
const baseUrl =
  process.env.NEXT_PUBLIC_NODE_ENV === "production"
    ? process.env.BACKEND_URL_PROD
    : process.env.BACKEND_URL_DEV;
console.log("baseUrl", baseUrl);
module.exports = {
  async rewrites() {
    if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
      return [
        {
          source: "/api/:slug*",
          destination: `${baseUrl}/api/:slug*`,
        },
      ];
    } else {
      return [
        {
          source: "/api/:slug*",
          destination: `${baseUrl}/api/:slug*`,
        },
      ];
    }
  },
};
