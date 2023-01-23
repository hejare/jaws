/** @type {import('next').NextConfig} */

const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  publicRuntimeConfig: {
    IMAGE_SERVICE_BASE_URL: process.env.IMAGE_SERVICE_BASE_URL,
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
  sentry: {
    hideSourceMaps: false,
  },
};

if (Boolean(process.env.NO_SENTRY)) {
  console.info("Building production bundle without Sentry ...");
  module.exports = nextConfig;
} else {
  module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
}
