import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Jupiter RFQ Webhook Toolkit',
  tagline: 'Complete documentation for Jupiter RFQ webhook integration',
  favicon: 'img/jupiter-ag-jup-logo.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://jup-ag.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'jup-ag', // Usually your GitHub org/user name.
  projectName: 'rfq-webhook-toolkit', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/jup-ag/rfq-webhook-toolkit/tree/main/',
        },
        blog: false, // Disable blog functionality
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'stats',
        path: 'docs/stats',
        routeBasePath: 'stats',
        sidebarPath: './sidebars-stats.ts',
        editUrl: 'https://github.com/jup-ag/rfq-webhook-toolkit/tree/main/',
      },
    ],
  ],

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/jupiter-ag-jup-logo.svg',
    navbar: {
      title: 'Jupiter RFQ',
      logo: {
        alt: 'Jupiter RFQ Logo',
        src: 'img/jupiter-ag-jup-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Webhook Integration',
        },
        {
          to: '/stats/overview',
          position: 'left',
          label: 'JupiterZ API',
        },
        {
          href: 'https://github.com/jup-ag/rfq-webhook-toolkit',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Webhook Integration',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'Integration Guide',
              to: '/docs/integration/overview',
            },
            {
              label: 'API Reference',
              to: '/docs/api/overview',
            },
          ],
        },
        {
          title: 'JupiterZ API',
          items: [
            {
              label: 'Overview',
              to: '/stats/overview',
            },
            {
              label: 'API Reference',
              to: '/stats/api-reference',
            },
          ],
        },
        {
          title: 'Jupiter',
          items: [
            {
              label: 'Main Website',
              href: 'https://jup.ag',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/jup',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/JupiterExchange',
            },
          ],
        },
        {
          title: 'Developer Resources',
          items: [
            {
              label: 'GitHub Repository',
              href: 'https://github.com/jup-ag/rfq-webhook-toolkit',
            },
            {
              label: 'Testing Guide',
              to: '/docs/testing/overview',
            },
            {
              label: 'FAQ',
              to: '/docs/faq',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Jupiter Exchange. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  // Custom head configuration
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
      },
    },
  ],
};

export default config;
