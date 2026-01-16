import * as path from 'path';
import { defineConfig } from '@rspress/core';
import { pluginCallstackTheme } from '@callstack/rspress-theme/plugin';
import { pluginOpenGraph } from 'rsbuild-plugin-open-graph';
import pluginVercelAnalytics from 'rspress-plugin-vercel-analytics';

type SidebarItem =
  | { text: string; link: string }
  | { text: string; collapsed?: boolean; items: SidebarItem[] };

// Shared sidebar structure for docs section
const createDocsSidebar = (
  version: string,
  extras: { guides?: string[]; migration?: SidebarItem[] } = {},
): SidebarItem[] => {
  const prefix = version ? `/${version}` : '';
  return [
    {
      text: 'Getting started',
      items: [
        { text: 'Introduction', link: `${prefix}/docs/start/intro` },
        { text: 'Quick Start', link: `${prefix}/docs/start/quick-start` },
      ],
    },
    {
      text: 'API reference',
      items: [
        { text: 'Render function', link: `${prefix}/docs/api/render` },
        { text: 'Screen object', link: `${prefix}/docs/api/screen` },
        { text: 'Queries', link: `${prefix}/docs/api/queries` },
        { text: 'Jest Matchers', link: `${prefix}/docs/api/jest-matchers` },
        {
          text: 'Triggering events',
          items: [
            { text: 'Fire Event', link: `${prefix}/docs/api/events/fire-event` },
            { text: 'User Event', link: `${prefix}/docs/api/events/user-event` },
          ],
        },
        {
          text: 'Miscellaneous',
          items: [
            { text: 'Accessibility', link: `${prefix}/docs/api/misc/accessibility` },
            { text: 'Async utilities', link: `${prefix}/docs/api/misc/async` },
            { text: 'Config', link: `${prefix}/docs/api/misc/config` },
            { text: 'Other', link: `${prefix}/docs/api/misc/other` },
            { text: 'Render Hook', link: `${prefix}/docs/api/misc/render-hook` },
          ],
        },
      ],
    },
    {
      text: 'Guides',
      items: [
        { text: 'How to Query', link: `${prefix}/docs/guides/how-to-query` },
        ...(extras.guides || []).map((g) => ({
          text: g === 'react-19' ? 'React 19' : g,
          link: `${prefix}/docs/guides/${g}`,
        })),
        { text: 'Troubleshooting', link: `${prefix}/docs/guides/troubleshooting` },
        { text: 'FAQ', link: `${prefix}/docs/guides/faq` },
        { text: 'Community Resources', link: `${prefix}/docs/guides/community-resources` },
      ],
    },
    {
      text: 'Advanced Guides',
      items: [
        { text: 'Testing Environment', link: `${prefix}/docs/advanced/testing-env` },
        ...(version !== '12.x' && version !== ''
          ? [{ text: 'Third-party Integration', link: `${prefix}/docs/advanced/third-party-integration` }]
          : []),
        ...(version === ''
          ? [{ text: 'Third-party Integration', link: `${prefix}/docs/advanced/third-party-integration` }]
          : []),
        { text: 'Understanding Act', link: `${prefix}/docs/advanced/understanding-act` },
      ],
    },
    {
      text: 'Migration Guides',
      collapsed: true,
      items: extras.migration || [],
    },
  ];
};

const createCookbookSidebar = (version: string, asyncFileName: string): SidebarItem[] => {
  const prefix = version ? `/${version}` : '';
  return [
    { text: 'Cookbook', link: `${prefix}/cookbook/` },
    {
      text: 'Basic Recipes',
      items: [
        { text: 'Async Tests', link: `${prefix}/cookbook/basics/${asyncFileName}` },
        { text: 'Custom Render', link: `${prefix}/cookbook/basics/custom-render` },
      ],
    },
    {
      text: 'Advanced Recipes',
      items: [{ text: 'Network Requests', link: `${prefix}/cookbook/advanced/network-requests` }],
    },
    {
      text: 'State Management Recipes',
      items: [{ text: 'Jotai', link: `${prefix}/cookbook/state-management/jotai` }],
    },
  ];
};

// Version-specific configurations
const sidebar12x = {
  '/12.x/docs/': createDocsSidebar('12.x', {
    migration: [
      { text: 'v12 Migration', link: '/12.x/docs/migration/v12' },
      { text: 'Jest Matchers', link: '/12.x/docs/migration/jest-matchers' },
      {
        text: 'Previous versions',
        collapsed: true,
        items: [
          { text: 'v11', link: '/12.x/docs/migration/previous/v11' },
          { text: 'v9', link: '/12.x/docs/migration/previous/v9' },
          { text: 'v7', link: '/12.x/docs/migration/previous/v7' },
          { text: 'v2', link: '/12.x/docs/migration/previous/v2' },
        ],
      },
    ],
  }),
  '/12.x/cookbook/': createCookbookSidebar('12.x', 'async-tests'),
};

const sidebar13x = {
  '/13.x/docs/': createDocsSidebar('13.x', {
    guides: ['react-19'],
    migration: [
      { text: 'v13 Migration', link: '/13.x/docs/migration/v13' },
      { text: 'Jest Matchers', link: '/13.x/docs/migration/jest-matchers' },
      {
        text: 'Previous versions',
        collapsed: true,
        items: [
          { text: 'v12', link: '/13.x/docs/migration/previous/v12' },
          { text: 'v11', link: '/13.x/docs/migration/previous/v11' },
          { text: 'v9', link: '/13.x/docs/migration/previous/v9' },
          { text: 'v7', link: '/13.x/docs/migration/previous/v7' },
          { text: 'v2', link: '/13.x/docs/migration/previous/v2' },
        ],
      },
    ],
  }),
  '/13.x/cookbook/': createCookbookSidebar('13.x', 'async-tests'),
};

const sidebar14x = {
  '/14.x/docs/': createDocsSidebar('14.x', {
    migration: [
      { text: 'v14 Migration', link: '/14.x/docs/migration/v14' },
      { text: 'Jest Matchers', link: '/14.x/docs/migration/jest-matchers' },
      { text: 'v13', link: '/14.x/docs/migration/v13' },
      { text: 'v12', link: '/14.x/docs/migration/v12' },
      { text: 'v11', link: '/14.x/docs/migration/v11' },
      { text: 'v9', link: '/14.x/docs/migration/v9' },
      { text: 'v7', link: '/14.x/docs/migration/v7' },
      { text: 'v2', link: '/14.x/docs/migration/v2' },
    ],
  }),
  '/14.x/cookbook/': createCookbookSidebar('14.x', 'async-events'),
};

// Default version (13.x) sidebar without version prefix
const sidebarDefault = {
  '/docs/': createDocsSidebar('', {
    guides: ['react-19'],
    migration: [
      { text: 'v13 Migration', link: '/docs/migration/v13' },
      { text: 'Jest Matchers', link: '/docs/migration/jest-matchers' },
      {
        text: 'Previous versions',
        collapsed: true,
        items: [
          { text: 'v12', link: '/docs/migration/previous/v12' },
          { text: 'v11', link: '/docs/migration/previous/v11' },
          { text: 'v9', link: '/docs/migration/previous/v9' },
          { text: 'v7', link: '/docs/migration/previous/v7' },
          { text: 'v2', link: '/docs/migration/previous/v2' },
        ],
      },
    ],
  }),
  '/cookbook/': createCookbookSidebar('', 'async-tests'),
};

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
    // checkDeadLinks is enabled by default in V2
    // Shiki is now the default code highlighter
  },
  multiVersion: {
    default: '13.x',
    versions: ['12.x', '13.x', '14.x'],
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
    nav: [
      { text: 'Docs', link: '/docs/start/intro', activeMatch: '^/docs/' },
      { text: 'Cookbook', link: '/cookbook/', activeMatch: '^/cookbook/' },
      {
        text: 'Examples',
        link: 'https://github.com/callstack/react-native-testing-library/tree/main/examples',
      },
    ],
    sidebar: {
      ...sidebarDefault,
      ...sidebar12x,
      ...sidebar13x,
      ...sidebar14x,
    },
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
