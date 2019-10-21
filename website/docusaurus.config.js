const siteConfig = {
    title: 'React Native Testing Library', // Title for your website.
    tagline: 'Helps you to write better tests with less effort.',
    url: 'https://callstack.github.io', // Your website URL
    baseUrl: '/react-native-testing-library/', // Base URL for your project
    favicon: 'img/owl.png',

    projectName: 'react-native-testing-library',
    organizationName: 'callstack',

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
                        }
                    ],
                },
            ],
            // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
            copyright: `Copyright © ${new Date().getFullYear()} Callstack Open Source`,
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
