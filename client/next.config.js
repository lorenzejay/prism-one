/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
      return [
        {
          source: "/api/:slug*",
          destination: `https://prism-one-crm-backend.herokuapp.com/api/:slug*`,
        },
      ];
    } else {
      const baseUrl = "http://localhost:5001";
      return [
        {
          source: "/api/:slug*",
          destination: `${baseUrl}/api/:slug*`,
        },
      ];
    }
  },
};
