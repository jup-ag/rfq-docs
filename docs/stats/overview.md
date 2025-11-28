---
title: Overview
description: Access RFQ performance metrics and analytics with the JupiterZ API
sidebar_position: 1
---

# JupiterZ API

The JupiterZ API provides comprehensive analytics and performance metrics for the Jupiter RFQ system. This API enables market makers, developers, and analysts to track volumes, fees, transaction data, and other key performance indicators.

## What Can You Track?

The Stats API provides access to:

- **Volume Metrics**: Track trading volume in USD across different timeframes
- **Fee Analytics**: Monitor fee generation and average fee rates
- **Transaction Data**: Access detailed transaction information by ID, slot, or request ID
- **Market Maker Performance**: View top-performing market makers
- **Token Pair Analytics**: Identify most active trading pairs
- **Daily Breakdowns**: Get day-by-day statistics for trend analysis

## Use Cases

### For Market Makers
- Monitor your performance and market share
- Track fee generation from your quotes
- Analyze which token pairs are most active
- Compare your performance against other market makers

### For Developers
- Build dashboards and analytics tools
- Integrate RFQ metrics into existing systems
- Monitor system health and transaction flow
- Create custom reports and visualizations

### For Analysts
- Research trading patterns and trends
- Analyze market efficiency
- Track protocol growth and adoption
- Generate performance reports

## Getting Started

The API is organized into several categories:

1. **[Transaction Endpoints](./api-reference#transaction-endpoints)**: Query individual transactions and transaction metadata
2. **[Statistics Endpoints](./api-reference#statistics-endpoints)**: Access aggregated metrics and analytics
3. **[Token & Pair Analytics](./api-reference#token-pair-analytics)**: Get insights on specific tokens and trading pairs

## Base URL

```
https://stats.jup.ag
```

:::info Development Environment
For testing and development, a sandbox environment may be available. Contact the Jupiter team for access details.
:::

## Authentication

Currently, the Stats API is publicly accessible without authentication. Rate limiting applies to ensure fair usage.

## Rate Limits

- **Global Rate Limit**: 1 request per second per IP address
- **Response**: `429 Too Many Requests` when limit is exceeded
- **Best Practice**: Implement exponential backoff for retries

## Response Format

All API responses follow a consistent structure:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "error": null
}
```

### Error Response
```json
{
  "success": false,
  "data": null,
  "error": "Detailed error message"
}
```

## HTTP Status Codes

- `200 OK`: Request successful
- `400 Bad Request`: Invalid parameters or malformed request
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side error

## Data Freshness

- Statistics are updated in real-time as transactions are processed
- 7-day metrics are calculated on a rolling window basis
- Daily statistics reflect UTC timezone boundaries

## Example: Getting Started

Here's a simple example to fetch the 7-day comprehensive statistics:

```bash
curl https://stats.jup.ag/api/stats/7d/comprehensive
```

Response:
```json
{
  "success": true,
  "data": {
    "total_volume_usd": "15234567.89",
    "total_fees_usd": "3456.78",
    "trade_count": 12345,
    "average_fee_bps": 25,
    "unique_makers": 42,
    "unique_tokens": 156
  },
  "error": null
}
```

## Next Steps

- Review the complete [API Reference](./api-reference) for detailed endpoint documentation
- Learn about [data models and response schemas](./api-reference#data-models)
- Check out [example queries and use cases](./api-reference#examples)

## Support

For questions or issues with the JupiterZ API:
- Review the [FAQ](../faq) for common questions
- Check the [API Reference](./api-reference) for detailed documentation
- Reach out on [Telegram](https://t.me/biuu0x) for support
