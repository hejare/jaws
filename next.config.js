/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  publicRuntimeConfig: {
    SERVICE_SHARKSTER_IMAGE_SERVER_BASE_URL: process.env.SERVICE_SHARKSTER_IMAGE_SERVER_BASE_URL,
  }
}

module.exports = nextConfig
