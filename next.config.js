/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    BASE_API_URL: process.env.NODE_ENV === "development" ? "http://localhost:4000" : "https://api.dr-solar2023.com",
    userTokenNameInLocalStorage: "dr-solar-user-token",
    adminTokenNameInLocalStorage: "dr-solar-admin-token",
  },
  async headers() {
    return [
      {
        source: process.env.NODE_ENV === "development" ? "//localhost:4000/(.*)" : "//api.dr-solar2023.com/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://dr-solar2023.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ]
      }
    ];
  }
}

module.exports = nextConfig;