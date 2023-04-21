const repoUrl = 'https://github.com/callstack/react-native-testing-library';
const title = 'React Native Testing Library';

const siteConfig = {
  title, // Title for your website.
  tagline: 'Helps you to write better tests with less effort.',
  url: 'https://callstack.github.io', // Your website URL
  baseUrl: '/react-native-testing-library/', // Base URL for your project
  // The name of the GitHub repository. Used by the deployment command
  projectName: 'react-native-testing-library',
  organizationName: 'callstack',
  favicon: 'img/owl.png',
  trailingSlash: false,

  themeConfig: {
    navbar: {
      title,
      logo: {
        alt: title,
        src: 'img/owl.png',
      },
      items: [
        { to: 'docs/getting-started', label: 'Docs', position: 'right' },
        { href: repoUrl, label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              key: 1,
              label: 'Getting started',
              to: 'docs/getting-started',
            },
            {
              key: 2,
              label: 'API',
              to: 'docs/api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              key: 3,
              label: 'Stack Overflow',
              href: 'http://stackoverflow.com/questions/tagged/react-native-testing-library',
            },
            {
              key: 4,
              label: 'Discord Channel',
              href: 'https://discord.gg/QbGezWe',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              key: 5,
              label: 'GitHub',
              href: repoUrl,
            },
            {
              key: 6,
              label: 'Star',
              href: repoUrl,
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Callstack Open Source`,
    },
    image: 'img/owl.png',
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
      defaultLanguage: 'jsx',
    },
    algolia: {
      appId: '6CJ0BV6AVN',
      apiKey: '198ecded5a7987b04767482a8d6fe602',
      indexName: 'crawler_React Native Testing Library Docs',
    },
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: `${repoUrl}/blob/main/website`,
          sidebarCollapsible: false,
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: `${repoUrl}/blob/main/blog`,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};

module.exports = siteConfig;
