import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Sidebar configuration for Statistics API documentation
 */
const sidebarStats: SidebarsConfig = {
  statsSidebar: [
    {
      type: 'doc',
      id: 'overview',
      label: 'Overview',
    },
    {
      type: 'doc',
      id: 'api-reference',
      label: 'API Reference',
    },
  ],
};

export default sidebarStats;
