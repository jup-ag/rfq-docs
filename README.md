# JupiterZ Documentation

This documentation site provides comprehensive guidance for market makers integrating with Jupiter's Request for Quote (RFQ) system.

## Overview

JupiterZ allows market makers to provide liquidity through competitive quotes rather than traditional AMM pools. This results in:

- **Lower computational costs** (10x less than AMM swaps)
- **Better pricing control** for market makers
- **Improved user experience** with competitive quotes

## Documentation Structure

- **[Introduction](./docs/intro.md)** - Overview and getting started
- **[Integration Guide](./docs/integration/)** - Complete integration process
- **[API Reference](./docs/api/)** - Detailed API specifications
- **[Testing](./docs/testing/)** - Testing tools and troubleshooting
- **[FAQ](./docs/faq.md)** - Frequently asked questions

## Quick Start

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```bash
npm install
```

### Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Contributing

This documentation is based on the official JupiterZ Webhook Toolkit:
- **GitHub Repository**: [jup-ag/rfq-webhook-toolkit](https://github.com/jup-ag/rfq-webhook-toolkit)
- **Contact**: [Jo on Telegram](https://t.me/biuu0x) for integration support

## Technology Stack

- **Docusaurus v3** - Documentation framework
- **TypeScript** - Type-safe development
- **React** - Component-based UI
- **Markdown** - Content authoring

## License

This documentation follows the same license as the JupiterZ Webhook Toolkit.
