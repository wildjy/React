import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  webpackFinal: async (config) => {
    if (config.module?.rules) {
      // 기본 CSS 룰 제거 (충돌 방지)
      config.module.rules = config.module.rules.filter((rule: any) => {
        return !(rule.test instanceof RegExp && rule.test.test("test.css"));
      });
    }

    config.module = config.module || { rules: [] } as any;
    const rules = (config.module as any).rules || [];
    
    // PostCSS/Tailwind 처리
    rules.push({
      test: /\.css$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: { importLoaders: 1 }
        },
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: {
                tailwindcss: {},
                autoprefixer: {},
              }
            }
          }
        }
      ]
    });

    rules.push({
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [
              require.resolve("@babel/preset-env"),
              [require.resolve("@babel/preset-react"), { runtime: "automatic" }],
              require.resolve("@babel/preset-typescript")
            ]
          }
        }
      ]
    });
    
    (config.module as any).rules = rules;
    (config.resolve as any).extensions = [
      ...((config.resolve as any).extensions || []),
      ".ts",
      ".tsx"
    ];
    return config;
  },
};
export default config;
