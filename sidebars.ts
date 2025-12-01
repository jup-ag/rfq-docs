import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Custom sidebar structure for Jupiter RFQ Webhook Integration
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Integration Guide',
      items: [
        'integration/overview',
        'integration/webhook-implementation',
        'integration/deployment',
      ],
    },
    'circuit_breaker',
    'understanding_ids',
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/overview',
        'api/tokens',
        'api/quote',
        'api/swap',
      ],
    },
    {
      type: 'category',
      label: 'Testing',
      items: [
        'testing/overview',
        'testing/troubleshooting',
      ],
    },
    'faq',
  ],
  
  // Sidebar for JupiterZ API documentation
  statsSidebar: [
    'stats/overview',
    'stats/api-reference',
  ],
};

export default sidebars;
