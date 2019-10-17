/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const repoUrl = 'https://github.com/callstack/react-native-testing-library';

const siteConfig = {
    title: 'React Native Testing Library', // Title for your website.
    tagline: 'Helps you to write better tests with less effort.',
    url: 'https://callstack.github.io', // Your website URL
    baseUrl: '/react-native-testing-library/', // Base URL for your project
    favicon: 'img/owl.png',
    // Used for publishing and more
    projectName: 'react-native-testing-library',
    organizationName: 'callstack',
    // For top-level user or org sites, the organization is still the same.
    // e.g., for the https://JoelMarcey.github.io site, it would be set like...
    //   organizationName: 'JoelMarcey'
    themeConfig: {
        navbar: {
            title: 'React Native Testing Library',
            style: 'dark',
            logo: {
                alt: 'React Native Testing Library',
                src: 'img/owl.png',
            },
            links: [
                {to: 'docs/getting-started', label: 'Docs', position: 'right'},
                {
                    href: 'https://github.com/facebook/docusaurus',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Getting Started',
                            to: 'docs/getting-started',
                        },
                        {
                            label: 'API Reference',
                            to: 'docs/api',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'Slack Overflow',
                            href: 'https://stackoverflow.com/questions/tagged/react-native-testing-library',
                        },
                        {
                            label: 'Discord channel',
                            href: 'https://discord.gg/QbGezWe',
                        },
                    ],
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'Github',
                            href: 'https://github.com/callstack/react-native-testing-library',
                        },
                        {
                            label: 'Star',
                            href: 'https://github.com/callstack/react-native-testing-library',
                        },

                    ],
                },
            ],
            // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
            copyright: `Copyright © ${new Date().getFullYear()} Callstack Open Source`,
            highlight: {
                // Highlight.js theme to use for syntax highlighting in code blocks.
                theme: 'dark',
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
            repoUrl,
            usePrism: ['jsx'],
        },
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    // docs folder path relative to website dir.
                    path: '../docs',
                    // sidebars file relative to website dir.
                    sidebarPath: require.resolve('./sidebars.json'),
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
};


module.exports = siteConfig;
