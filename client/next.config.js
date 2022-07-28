/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    async rewrites() {
      // const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL_PROD;
      if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
        return [
          {
            source: "/api/:slug*",
            destination: `${process.env.NEXT_PUBLIC_BACKEND_URL_PROD}/api/:slug*`,
          },
        ];
      } else {
        // const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL_DEV;
        return [
          {
            source: "/api/:slug*",
            destination: `${process.env.NEXT_PUBLIC_BACKEND_URL_DEV}/api/:slug*`,
          },
        ];
      }
    },
  },
};
