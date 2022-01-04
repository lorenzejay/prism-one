/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    const baseUrl = "https://prism-one-crm-backend.herokuapp.com";
    if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
      return [
        {
          source: "/api/:slug*",
          destination: `${baseUrl}/api/:slug*`,
        },
      ];
    } else {
      const baseUrl = "http://localhost:5000";
      return [
        {
          source: "/api/:slug*",
          destination: `${baseUrl}/api/:slug*`,
        },
      ];
    }
  },
};
