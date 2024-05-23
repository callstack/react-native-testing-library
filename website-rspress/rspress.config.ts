import * as path from 'path';
import { defineConfig } from 'rspress/config';
import { pluginFontOpenSans } from 'rspress-plugin-font-open-sans';
import vercelAnalytics from 'rspress-plugin-vercel-analytics';
import { pluginOpenGraph } from 'rsbuild-plugin-open-graph';

export default defineConfig({
  root: path.join(__dirname, 'src'),
  title: 'Re.Pack',
  description: 'A toolkit to build your React Native application with Webpack.',
  icon: '/img/favicon.ico',
  logo: {
    light: '/img/logo_light.svg',
    dark: '/img/logo_dark.svg',
  },
  outDir: 'build',
  markdown: {
    checkDeadLinks: true,
    codeHighlighter: 'prism',
  },
  multiVersion: {
    default: '4.x',
    versions: ['2.x', '3.x', '4.x'],
  },
  route: {
    cleanUrls: true,
  },
  search: {
    versioned: true,
  },
  themeConfig: {
    enableContentAnimation: true,
    enableScrollToTop: true,
    outlineTitle: 'Contents',
    footer: {
      message: 'Copyright © 2024 Callstack Open Source',
    },
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/callstack/repack',
      },
      {
        icon: 'X',
        mode: 'link',
        content: 'https://x.com/repack_rn',
      },
      {
        icon: 'discord',
        mode: 'link',
        content: 'https://discord.gg/TWDBep3nXV',
      },
    ],
  },
  globalStyles: path.join(__dirname, 'src/styles/index.css'),
  builderConfig: {
    plugins: [
      pluginOpenGraph({
        title: 'Re.Pack',
        type: 'website',
        url: 'https://re-pack.dev',
        image: 'https://re-pack.dev/img/og-image.png',
        description:
          'A toolkit to build your React Native application with Webpack.',
        twitter: {
          site: '@repack_rn',
          card: 'summary_large_image',
        },
      }),
    ],
    tools: {
      rspack(config, { addRules }) {
        addRules([
          {
            resourceQuery: /raw/,
            type: 'asset/source',
          },
        ]);
      },
    },
  },
  plugins: [pluginFontOpenSans(), vercelAnalytics()],
});
