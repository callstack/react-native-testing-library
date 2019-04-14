/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const repoUrl = 'https://github.com/callstack/react-native-testing-library';

const siteConfig = {
  title: 'React Native Testing Library', // Title for your website.
  tagline: 'Helps you to write better tests with less effort.',
  url: 'https://callstack.github.io', // Your website URL
  baseUrl: '/react-native-testing-library/', // Base URL for your project

  // Used for publishing and more
  projectName: 'react-native-testing-library',
  organizationName: 'callstack',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: 'getting-started', label: 'Docs' },
    { href: repoUrl, label: 'GitHub' },
  ],

  /* path to images for header/footer */
  headerIcon: 'img/owl.png',
  footerIcon: 'img/owl.png',
  favicon: 'img/owl.png',

  /* Colors for website */
  colors: {
    primaryColor: '#262626',
    secondaryColor: '#bf8a65',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Callstack Open Source`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/docusaurus.png',
  twitterImage: 'img/docusaurus.png',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl,
  usePrism: ['jsx'],
};

module.exports = siteConfig;
