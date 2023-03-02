/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  publicRuntimeConfig: {
    backendUrl: process.env.BASE_URL_API,
  },
  env: {
    APP_NAME: process.env.APP_NAME,
    BASE_URL_API: process.env.BASE_URL_API,
    BASE_URL_AUTH: process.env.BASE_URL_AUTH,
    JWT_SECRET: process.env.JWT_SECRET,
  },
};

module.exports = nextConfig;