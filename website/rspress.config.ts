import * as path from 'path';
import { defineConfig } from 'rspress/config';
import { pluginCallstackTheme } from '@callstack/rspress-theme/plugin';
import { pluginOpenGraph } from 'rsbuild-plugin-open-graph';
import pluginVercelAnalytics from 'rspress-plugin-vercel-analytics';

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
  themeConfig: {
    enableContentAnimation: true,
    enableScrollToTop: true,
    outlineTitle: 'Contents',
    footer: {
      message: `Copyright © ${new Date().getFullYear()} Callstack Open Source`,
    },
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/callstack/react-native-testing-library',
      },
    ],
  },
  builderConfig: {
    plugins: [
      pluginOpenGraph({
        title: 'React Native Testing Library',
        type: 'website',
        url: 'https://callstack.github.io/react-native-testing-library/',
        description: 'Helps you to write better tests with less effort.',
      }),
    ],
  },
  plugins: [
    pluginCallstackTheme(),
    // @ts-expect-error
    pluginVercelAnalytics(),
  ],
});
