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
  // V1 - Webhook Integration
  v1Sidebar: [
    'intro',
    {
      type: 'category',
      label: 'Integration Guide',
      items: [
        'integration/overview',
        'integration/webhook-implementation',
        'integration/squads',
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
        'api/permissioned-tokens',
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
  
  // V2 - New RFQ Documentation
  v2Sidebar: [
    'v2',
    {
      type: 'category',
      label: 'Market Maker Integration',
      items: [
        'v2/overview',
        'v2/getting-started',
        'v2/sdk-integration',
        'v2/last-look-and-safety',
        'v2/lifecycle-and-circuit-breaker',
        'v2/grpc-api',
        'v2/testing',
      ],
    },
  ],
  
  // Sidebar for JupiterZ API documentation
  statsSidebar: [
    'stats/overview',
    'stats/api-reference',
  ],
};

export default sidebars;
