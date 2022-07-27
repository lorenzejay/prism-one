/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL_PROD;
    if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
      return [
        {
          source: "/api/:slug*",
          destination: `${baseUrl}/api/:slug*`,
        },
      ];
    } else {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL_DEV;
      return [
        {
          source: "/api/:slug*",
          destination: `${baseUrl}/api/:slug*`,
        },
      ];
    }
  },
};
