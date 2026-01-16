import * as path from 'path';
import { defineConfig } from '@rspress/core';
import { pluginCallstackTheme } from '@callstack/rspress-theme/plugin';
import { pluginOpenGraph } from 'rsbuild-plugin-open-graph';
import pluginVercelAnalytics from 'rspress-plugin-vercel-analytics';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const sidebar12x = {
  '/12.x/docs/': [
    {
      text: 'Getting started',
      items: [
        { text: 'Introduction', link: '/12.x/docs/start/intro' },
        { text: 'Quick Start', link: '/12.x/docs/start/quick-start' },
      ],
    },
    {
      text: 'API reference',
      items: [
        { text: 'Render function', link: '/12.x/docs/api/render' },
        { text: 'Screen object', link: '/12.x/docs/api/screen' },
        { text: 'Queries', link: '/12.x/docs/api/queries' },
        { text: 'Jest Matchers', link: '/12.x/docs/api/jest-matchers' },
        {
          text: 'Triggering events',
          items: [
            { text: 'Fire Event', link: '/12.x/docs/api/events/fire-event' },
            { text: 'User Event', link: '/12.x/docs/api/events/user-event' },
          ],
        },
        {
          text: 'Miscellaneous',
          items: [
            { text: 'Accessibility', link: '/12.x/docs/api/misc/accessibility' },
            { text: 'Async utilities', link: '/12.x/docs/api/misc/async' },
            { text: 'Config', link: '/12.x/docs/api/misc/config' },
            { text: 'Other', link: '/12.x/docs/api/misc/other' },
            { text: 'Render Hook', link: '/12.x/docs/api/misc/render-hook' },
          ],
        },
      ],
    },
    {
      text: 'Guides',
      items: [
        { text: 'How to Query', link: '/12.x/docs/guides/how-to-query' },
        { text: 'Troubleshooting', link: '/12.x/docs/guides/troubleshooting' },
        { text: 'FAQ', link: '/12.x/docs/guides/faq' },
        { text: 'Community Resources', link: '/12.x/docs/guides/community-resources' },
      ],
    },
    {
      text: 'Advanced Guides',
      items: [
        { text: 'Testing Environment', link: '/12.x/docs/advanced/testing-env' },
        { text: 'Understanding Act', link: '/12.x/docs/advanced/understanding-act' },
      ],
    },
    {
      text: 'Migration Guides',
      collapsed: true,
      items: [
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
    },
  ],
  '/12.x/cookbook/': [
    { text: 'Cookbook', link: '/12.x/cookbook/' },
    {
      text: 'Basic Recipes',
      items: [
        { text: 'Async Tests', link: '/12.x/cookbook/basics/async-tests' },
        { text: 'Custom Render', link: '/12.x/cookbook/basics/custom-render' },
      ],
    },
    {
      text: 'Advanced Recipes',
      items: [{ text: 'Network Requests', link: '/12.x/cookbook/advanced/network-requests' }],
    },
    {
      text: 'State Management Recipes',
      items: [{ text: 'Jotai', link: '/12.x/cookbook/state-management/jotai' }],
    },
  ],
};

const sidebar13x = {
  '/13.x/docs/': [
    {
      text: 'Getting started',
      items: [
        { text: 'Introduction', link: '/13.x/docs/start/intro' },
        { text: 'Quick Start', link: '/13.x/docs/start/quick-start' },
      ],
    },
    {
      text: 'API reference',
      items: [
        { text: 'Render function', link: '/13.x/docs/api/render' },
        { text: 'Screen object', link: '/13.x/docs/api/screen' },
        { text: 'Queries', link: '/13.x/docs/api/queries' },
        { text: 'Jest Matchers', link: '/13.x/docs/api/jest-matchers' },
        {
          text: 'Triggering events',
          items: [
            { text: 'Fire Event', link: '/13.x/docs/api/events/fire-event' },
            { text: 'User Event', link: '/13.x/docs/api/events/user-event' },
          ],
        },
        {
          text: 'Miscellaneous',
          items: [
            { text: 'Accessibility', link: '/13.x/docs/api/misc/accessibility' },
            { text: 'Async utilities', link: '/13.x/docs/api/misc/async' },
            { text: 'Config', link: '/13.x/docs/api/misc/config' },
            { text: 'Other', link: '/13.x/docs/api/misc/other' },
            { text: 'Render Hook', link: '/13.x/docs/api/misc/render-hook' },
          ],
        },
      ],
    },
    {
      text: 'Guides',
      items: [
        { text: 'How to Query', link: '/13.x/docs/guides/how-to-query' },
        { text: 'React 19', link: '/13.x/docs/guides/react-19' },
        { text: 'Troubleshooting', link: '/13.x/docs/guides/troubleshooting' },
        { text: 'FAQ', link: '/13.x/docs/guides/faq' },
        { text: 'Community Resources', link: '/13.x/docs/guides/community-resources' },
      ],
    },
    {
      text: 'Advanced Guides',
      items: [
        { text: 'Testing Environment', link: '/13.x/docs/advanced/testing-env' },
        { text: 'Third-party Integration', link: '/13.x/docs/advanced/third-party-integration' },
        { text: 'Understanding Act', link: '/13.x/docs/advanced/understanding-act' },
      ],
    },
    {
      text: 'Migration Guides',
      collapsed: true,
      items: [
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
    },
  ],
  '/13.x/cookbook/': [
    { text: 'Cookbook', link: '/13.x/cookbook/' },
    {
      text: 'Basic Recipes',
      items: [
        { text: 'Async Tests', link: '/13.x/cookbook/basics/async-tests' },
        { text: 'Custom Render', link: '/13.x/cookbook/basics/custom-render' },
      ],
    },
    {
      text: 'Advanced Recipes',
      items: [{ text: 'Network Requests', link: '/13.x/cookbook/advanced/network-requests' }],
    },
    {
      text: 'State Management Recipes',
      items: [{ text: 'Jotai', link: '/13.x/cookbook/state-management/jotai' }],
    },
  ],
};

const sidebar14x = {
  '/14.x/docs/': [
    {
      text: 'Getting started',
      items: [
        { text: 'Introduction', link: '/14.x/docs/start/intro' },
        { text: 'Quick Start', link: '/14.x/docs/start/quick-start' },
        { text: 'v14 Migration', link: '/14.x/docs/start/migration-v14' },
      ],
    },
    {
      text: 'API reference',
      items: [
        { text: 'Render function', link: '/14.x/docs/api/render' },
        { text: 'Screen object', link: '/14.x/docs/api/screen' },
        { text: 'Queries', link: '/14.x/docs/api/queries' },
        { text: 'Jest Matchers', link: '/14.x/docs/api/jest-matchers' },
        {
          text: 'Triggering events',
          items: [
            { text: 'Fire Event', link: '/14.x/docs/api/events/fire-event' },
            { text: 'User Event', link: '/14.x/docs/api/events/user-event' },
          ],
        },
        {
          text: 'Miscellaneous',
          items: [
            { text: 'Accessibility', link: '/14.x/docs/api/misc/accessibility' },
            { text: 'Async utilities', link: '/14.x/docs/api/misc/async' },
            { text: 'Config', link: '/14.x/docs/api/misc/config' },
            { text: 'Other', link: '/14.x/docs/api/misc/other' },
            { text: 'Render Hook', link: '/14.x/docs/api/misc/render-hook' },
          ],
        },
      ],
    },
    {
      text: 'Guides',
      items: [
        { text: 'How to Query', link: '/14.x/docs/guides/how-to-query' },
        { text: 'Troubleshooting', link: '/14.x/docs/guides/troubleshooting' },
        { text: 'FAQ', link: '/14.x/docs/guides/faq' },
        { text: 'Community Resources', link: '/14.x/docs/guides/community-resources' },
      ],
    },
    {
      text: 'Advanced Guides',
      items: [
        { text: 'Testing Environment', link: '/14.x/docs/advanced/testing-env' },
        { text: 'Third-party Integration', link: '/14.x/docs/advanced/third-party-integration' },
        { text: 'Understanding Act', link: '/14.x/docs/advanced/understanding-act' },
      ],
    },
  ],
  '/14.x/cookbook/': [
    { text: 'Cookbook', link: '/14.x/cookbook/' },
    {
      text: 'Basic Recipes',
      items: [
        { text: 'Async Events', link: '/14.x/cookbook/basics/async-events' },
        { text: 'Custom Render', link: '/14.x/cookbook/basics/custom-render' },
      ],
    },
    {
      text: 'Advanced Recipes',
      items: [{ text: 'Network Requests', link: '/14.x/cookbook/advanced/network-requests' }],
    },
    {
      text: 'State Management Recipes',
      items: [{ text: 'Jotai', link: '/14.x/cookbook/state-management/jotai' }],
    },
  ],
};

// Default version (13.x) sidebar without version prefix
const sidebarDefault = {
  '/docs/': [
    {
      text: 'Getting started',
      items: [
        { text: 'Introduction', link: '/docs/start/intro' },
        { text: 'Quick Start', link: '/docs/start/quick-start' },
      ],
    },
    {
      text: 'API reference',
      items: [
        { text: 'Render function', link: '/docs/api/render' },
        { text: 'Screen object', link: '/docs/api/screen' },
        { text: 'Queries', link: '/docs/api/queries' },
        { text: 'Jest Matchers', link: '/docs/api/jest-matchers' },
        {
          text: 'Triggering events',
          items: [
            { text: 'Fire Event', link: '/docs/api/events/fire-event' },
            { text: 'User Event', link: '/docs/api/events/user-event' },
          ],
        },
        {
          text: 'Miscellaneous',
          items: [
            { text: 'Accessibility', link: '/docs/api/misc/accessibility' },
            { text: 'Async utilities', link: '/docs/api/misc/async' },
            { text: 'Config', link: '/docs/api/misc/config' },
            { text: 'Other', link: '/docs/api/misc/other' },
            { text: 'Render Hook', link: '/docs/api/misc/render-hook' },
          ],
        },
      ],
    },
    {
      text: 'Guides',
      items: [
        { text: 'How to Query', link: '/docs/guides/how-to-query' },
        { text: 'React 19', link: '/docs/guides/react-19' },
        { text: 'Troubleshooting', link: '/docs/guides/troubleshooting' },
        { text: 'FAQ', link: '/docs/guides/faq' },
        { text: 'Community Resources', link: '/docs/guides/community-resources' },
      ],
    },
    {
      text: 'Advanced Guides',
      items: [
        { text: 'Testing Environment', link: '/docs/advanced/testing-env' },
        { text: 'Third-party Integration', link: '/docs/advanced/third-party-integration' },
        { text: 'Understanding Act', link: '/docs/advanced/understanding-act' },
      ],
    },
    {
      text: 'Migration Guides',
      collapsed: true,
      items: [
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
    },
  ],
  '/cookbook/': [
    { text: 'Cookbook', link: '/cookbook/' },
    {
      text: 'Basic Recipes',
      items: [
        { text: 'Async Tests', link: '/cookbook/basics/async-tests' },
        { text: 'Custom Render', link: '/cookbook/basics/custom-render' },
      ],
    },
    {
      text: 'Advanced Recipes',
      items: [{ text: 'Network Requests', link: '/cookbook/advanced/network-requests' }],
    },
    {
      text: 'State Management Recipes',
      items: [{ text: 'Jotai', link: '/cookbook/state-management/jotai' }],
    },
  ],
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
  globalStyles: path.join(__dirname, 'docs/styles/index.css'),
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
