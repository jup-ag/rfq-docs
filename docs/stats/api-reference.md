---
title: API Reference
description: Complete API reference for JupiterZ endpoints
sidebar_position: 2
---

# JupiterZ API Reference

Complete reference documentation for all JupiterZ API endpoints.

## Base URL

```
https://stats.jup.ag
```

## Health Check

### Check API Status

```http
GET /health
```

Check if the API is operational.

**Response**
```json
{
  "status": "healthy"
}
```

---

## Transaction Endpoints

### Get Transaction by ID

```http
GET /api/transactions/:id
```

Retrieve detailed information about a specific transaction.

**Path Parameters**
- `id` (string, required): Transaction ID

**Example**
```bash
curl https://stats.jup.ag/api/transactions/5KxN...abc123
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "5KxN...abc123",
    "slot": 123456789,
    "block_time": 1701234567,
    "signature": "3Kx...",
    "request_id": "94f052fa-3f...",
    "quote_id": "8fcc669f-21...",
    "maker": "7xYz...",
    "taker": "8xYN...",
    "input_token": "So11111111111111111111111111111111111111112",
    "output_token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "input_amount": "1000000000",
    "output_amount": "95000000",
    "fee_bps": 25,
    "fee_usd": "2.38"
  },
  "error": null
}
```

### Get Transaction Statistics

```http
GET /api/transactions/stats
```

Get overall transaction statistics across all time.

**Response**
```json
{
  "success": true,
  "data": {
    "total_transactions": 1234567,
    "total_volume_usd": "456789012.34",
    "total_fees_usd": "123456.78",
    "first_transaction_time": 1698234567,
    "last_transaction_time": 1701234567
  },
  "error": null
}
```

### Get Transactions by Slot Range

```http
GET /api/transactions/slot-range?start_slot={start}&end_slot={end}
```

Retrieve all transactions within a specific slot range.

**Query Parameters**
- `start_slot` (number, required): Starting slot number (inclusive)
- `end_slot` (number, required): Ending slot number (inclusive)

**Example**
```bash
curl "https://stats.jup.ag/api/transactions/slot-range?start_slot=123456789&end_slot=123456889"
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": "5KxN...",
      "slot": 123456789,
      "signature": "3Kx...",
      // ... transaction details
    }
  ],
  "error": null
}
```

### Get Latest Transaction

```http
GET /api/transactions/latest
```

Retrieve the most recent transaction.

**Response**
```json
{
  "success": true,
  "data": {
    "id": "5KxN...",
    "slot": 123456999,
    "block_time": 1701234999,
    // ... transaction details
  },
  "error": null
}
```

### Get Transaction by Request ID

```http
GET /api/transactions/by-request-id?request_id={uuid}
```

Find transaction hash using the Request ID.

**Query Parameters**
- `request_id` (string, required): Request UUID

**Example**
```bash
curl "https://stats.jup.ag/api/transactions/by-request-id?request_id=94f052fa-3f..."
```

**Response**
```json
{
  "success": true,
  "data": {
    "request_id": "94f052fa-3f...",
    "transaction_hash": "5KxN...",
    "found": true
  },
  "error": null
}
```

---

## Statistics Endpoints

All statistics endpoints provide 7-day rolling window metrics unless otherwise specified.

### Get 7-Day Volume

```http
GET /api/stats/7d/volume
```

Get total trading volume in USD over the last 7 days.

**Response**
```json
{
  "success": true,
  "data": {
    "volume_usd": "15234567.89",
    "period": "7d",
    "start_time": 1700629567,
    "end_time": 1701234567
  },
  "error": null
}
```

### Get 7-Day Fees

```http
GET /api/stats/7d/fees
```

Get total fees collected in USD over the last 7 days.

**Response**
```json
{
  "success": true,
  "data": {
    "fees_usd": "3456.78",
    "period": "7d",
    "start_time": 1700629567,
    "end_time": 1701234567
  },
  "error": null
}
```

### Get 7-Day Trade Count

```http
GET /api/stats/7d/trade-count
```

Get total number of trades executed in the last 7 days.

**Response**
```json
{
  "success": true,
  "data": {
    "trade_count": 12345,
    "period": "7d"
  },
  "error": null
}
```

### Get 7-Day Daily Statistics

```http
GET /api/stats/7d/daily
```

Get day-by-day breakdown of volume, fees, and trade counts.

**Response**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-11-28",
      "volume_usd": "2156789.12",
      "fees_usd": "489.23",
      "trade_count": 1789
    },
    {
      "date": "2024-11-27",
      "volume_usd": "2234567.89",
      "fees_usd": "512.34",
      "trade_count": 1823
    }
    // ... 5 more days
  ],
  "error": null
}
```

### Get 7-Day Average Fee

```http
GET /api/stats/7d/average-fee
```

Get average fee rate in basis points over the last 7 days.

**Response**
```json
{
  "success": true,
  "data": {
    "average_fee_bps": 25,
    "period": "7d"
  },
  "error": null
}
```

### Get Comprehensive 7-Day Statistics

```http
GET /api/stats/7d/comprehensive
```

Get all 7-day statistics in a single request.

**Response**
```json
{
  "success": true,
  "data": {
    "total_volume_usd": "15234567.89",
    "total_fees_usd": "3456.78",
    "trade_count": 12345,
    "average_fee_bps": 25,
    "unique_makers": 42,
    "unique_tokens": 156,
    "unique_pairs": 387,
    "period": "7d",
    "start_time": 1700629567,
    "end_time": 1701234567
  },
  "error": null
}
```

---

## Token & Pair Analytics

### Get Top Token Pairs

```http
GET /api/stats/7d/top-pairs?limit={limit}
```

Get the most traded token pairs by volume over the last 7 days.

**Query Parameters**
- `limit` (number, optional): Maximum number of pairs to return (default: 10, max: 100)

**Example**
```bash
curl "https://stats.jup.ag/api/stats/7d/top-pairs?limit=5"
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "input_token": "So11111111111111111111111111111111111111112",
      "output_token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "input_token_symbol": "SOL",
      "output_token_symbol": "USDC",
      "volume_usd": "5678901.23",
      "trade_count": 3456,
      "percentage_of_total": 37.28
    },
    {
      "rank": 2,
      "input_token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "output_token": "So11111111111111111111111111111111111111112",
      "input_token_symbol": "USDC",
      "output_token_symbol": "SOL",
      "volume_usd": "4567890.12",
      "trade_count": 2987,
      "percentage_of_total": 29.97
    }
    // ... more pairs
  ],
  "error": null
}
```

### Get Top Market Makers

```http
GET /api/stats/7d/top-makers?limit={limit}
```

Get the top performing market makers by volume over the last 7 days.

**Query Parameters**
- `limit` (number, optional): Maximum number of makers to return (default: 10, max: 100)

**Example**
```bash
curl "https://stats.jup.ag/api/stats/7d/top-makers?limit=5"
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "maker_address": "7xYz...",
      "volume_usd": "3456789.01",
      "fees_usd": "789.12",
      "trade_count": 2345,
      "percentage_of_total": 22.68,
      "average_fee_bps": 23
    },
    {
      "rank": 2,
      "maker_address": "9aBC...",
      "volume_usd": "2345678.90",
      "fees_usd": "612.34",
      "trade_count": 1987,
      "percentage_of_total": 15.39,
      "average_fee_bps": 26
    }
    // ... more makers
  ],
  "error": null
}
```

### Get Token Volume

```http
GET /api/stats/7d/token-volume?token_id={id}
```

Get volume statistics for a specific token over the last 7 days.

**Query Parameters**
- `token_id` (string, required): Token mint address

**Example**
```bash
curl "https://stats.jup.ag/api/stats/7d/token-volume?token_id=So11111111111111111111111111111111111111112"
```

**Response**
```json
{
  "success": true,
  "data": {
    "token_address": "So11111111111111111111111111111111111111112",
    "token_symbol": "SOL",
    "volume_as_input_usd": "6789012.34",
    "volume_as_output_usd": "5678901.23",
    "total_volume_usd": "12467913.57",
    "trade_count_as_input": 4567,
    "trade_count_as_output": 3987,
    "total_trades": 8554,
    "period": "7d"
  },
  "error": null
}
```

---

## Data Models

### Transaction Object

```typescript
{
  id: string;                    // Transaction ID
  slot: number;                  // Solana slot number
  block_time: number;            // Unix timestamp
  signature: string;             // Transaction signature
  request_id: string;            // Request UUID
  quote_id: string;              // Quote UUID
  maker: string;                 // Market maker wallet address
  taker: string;                 // User wallet address
  input_token: string;           // Input token mint address
  output_token: string;          // Output token mint address
  input_amount: string;          // Input amount (raw)
  output_amount: string;         // Output amount (raw)
  fee_bps: number;              // Fee in basis points
  fee_usd: string;              // Fee in USD
}
```

### Volume Stats Object

```typescript
{
  volume_usd: string;           // Total volume in USD
  period: string;               // Time period (e.g., "7d")
  start_time: number;           // Period start (Unix timestamp)
  end_time: number;             // Period end (Unix timestamp)
}
```

### Daily Stats Object

```typescript
{
  date: string;                 // Date in YYYY-MM-DD format
  volume_usd: string;           // Daily volume in USD
  fees_usd: string;             // Daily fees in USD
  trade_count: number;          // Number of trades
}
```

---

## Examples

### Example 1: Building a Market Maker Dashboard

Fetch comprehensive stats and top maker data:

```bash
# Get overall 7-day stats
curl https://stats.jup.ag/api/stats/7d/comprehensive

# Get your ranking among top makers
curl "https://stats.jup.ag/api/stats/7d/top-makers?limit=20"

# Get daily breakdown for charts
curl https://stats.jup.ag/api/stats/7d/daily
```

### Example 2: Monitoring Specific Token Pairs

Track SOL/USDC pair performance:

```bash
# Get top pairs
curl "https://stats.jup.ag/api/stats/7d/top-pairs?limit=50"

# Get SOL volume specifically
curl "https://stats.jup.ag/api/stats/7d/token-volume?token_id=So11111111111111111111111111111111111111112"

# Get USDC volume
curl "https://stats.jup.ag/api/stats/7d/token-volume?token_id=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
```

### Example 3: Transaction Lookup

Find transaction details by Request ID:

```bash
# Get transaction hash from Request ID
curl "https://stats.jup.ag/api/transactions/by-request-id?request_id=94f052fa-3f..."

# Get full transaction details
curl https://stats.jup.ag/api/transactions/5KxN...abc123
```

---

## Rate Limiting Best Practices

To avoid rate limit errors:

1. **Implement Exponential Backoff**
```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.status === 429) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

2. **Cache Responses**
```javascript
const cache = new Map();
const CACHE_TTL = 60000; // 1 minute

async function fetchWithCache(url) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}
```

3. **Batch Your Requests**
Use comprehensive endpoints like `/api/stats/7d/comprehensive` instead of making multiple individual requests.

---

## Error Handling

Always check the `success` field in responses:

```javascript
const response = await fetch('https://stats.jup.ag/api/stats/7d/volume');
const json = await response.json();

if (!json.success) {
  console.error('API Error:', json.error);
  // Handle error appropriately
} else {
  console.log('Volume:', json.data.volume_usd);
}
```

Common error messages:
- `"Invalid parameters"`: Check your query parameters
- `"Resource not found"`: Transaction or resource doesn't exist
- `"Rate limit exceeded"`: Wait before making another request
- `"Internal server error"`: Temporary server issue, retry later
