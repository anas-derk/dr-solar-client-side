/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    // BASE_API_URL: "http://localhost:9000",
    BASE_API_URL: "https://api.dr-solar2023.com",
  },
  async headers() {
    return [
      {
        // source: "//localhost:9000/(.*)",
        source: "//api.dr-solar2023.com/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            // value: "http://localhost:3000",
            value: "https://dr-solar2023.com",
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

module.exports = nextConfig
