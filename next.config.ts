import type { NextConfig } from "next";

function excludeSvgFromNextAssetRules(config: any) {
  for (const rule of config.module.rules) {
    if (!rule) continue;

    // case: rule.oneOf = [...]
    if (Array.isArray(rule.oneOf)) {
      for (const one of rule.oneOf) {
        if (one?.test instanceof RegExp && one.test.test(".svg")) {
          one.exclude = /\.svg$/i;
        }
      }
    }

    if (rule?.test instanceof RegExp && rule.test.test(".svg")) {
      rule.exclude = /\.svg$/i;
    }
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,

  webpack(config) {
    excludeSvgFromNextAssetRules(config);

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: { overrides: { removeViewBox: false } },
                },
              ],
            },
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;