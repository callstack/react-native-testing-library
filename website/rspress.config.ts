import * as path from 'path';
import { defineConfig } from 'rspress/config';
import { pluginFontOpenSans } from 'rspress-plugin-font-open-sans';
import vercelAnalytics from 'rspress-plugin-vercel-analytics';
import { pluginOpenGraph } from 'rsbuild-plugin-open-graph';
import callstackTheme from '@callstack/rspress-theme';

export default defineConfig({
  root: 'docs',
  base: '/react-native-testing-library/',
  title: 'React Native Testing Library',
  description: 'Helps you to write better tests with less effort.',
  icon: '/img/owl.png',
  logo: '/img/owl.png',
  logoText: 'React Native Testing Library',
  outDir: 'build',
  markdown: {
    checkDeadLinks: true,
    codeHighlighter: 'prism',
  },
  multiVersion: {
    default: '13.x',
    versions: ['12.x', '13.x'],
  },
  route: {
    cleanUrls: true,
  },
  search: {
    versioned: true,
  },
  theme: callstackTheme,
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
        content: 'https://github.com/callstack/react-native-testing-library',
      },
    ],
  },
  globalStyles: path.join(__dirname, 'docs/styles/index.css'),
  builderConfig: {
    plugins: [
      pluginOpenGraph({
        title: 'React Native Testing Library',
        type: 'website',
        url: 'https://callstack.github.io/react-native-testing-library/',
        description: 'Helps you to write better tests with less effort.',
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
