import type { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./next-intl.config.js");

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Отключаем проверку ошибок TypeScript во время сборки
    ignoreBuildErrors: true,
  },
  // TODO:
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpack: (config: any) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    // Need to use react-pdf library
    config.resolve.alias.canvas = false;
    return config;
  },
  experimental: {
    turbo: {
      resolveExtensions: [
        ".mdx",
        ".tsx",
        ".ts",
        ".jsx",
        ".js",
        ".mjs",
        ".json",
      ],
      // Need to use react-pdf library
      resolveAlias: {
        canvas: "./empty-module.ts",
      },
    },
  },
};

export default withNextIntl(nextConfig);
