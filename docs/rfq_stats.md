# RFQ Indexer API Reference

## Base URL
```
http://localhost:8080
```

## Rate Limiting
Global rate limit: 1 request per second. Returns `429 Too Many Requests` when exceeded.

## Endpoints

### Health Check
```
GET /health
```

### Transaction Endpoints

#### Get Transaction by ID
```
GET /api/transactions/:id
```
Parameters:
- `id` (path): Transaction ID

#### Get Transaction Statistics
```
GET /api/transactions/stats
```

#### Get Transactions by Slot Range
```
GET /api/transactions/slot-range?start_slot={start}&end_slot={end}
```
Query Parameters:
- `start_slot`: Starting slot number
- `end_slot`: Ending slot number

#### Get Latest Transaction
```
GET /api/transactions/latest
```

#### Get Transaction Hash by Request ID
```
GET /api/transactions/by-request-id?request_id={uuid}
```
Query Parameters:
- `request_id`: Request UUID

### RFQ Statistics Endpoints (7-Day)

#### Get 7-Day Volume (USD)
```
GET /api/stats/7d/volume
```

#### Get 7-Day Fees (USD)
```
GET /api/stats/7d/fees
```

#### Get 7-Day Trade Count
```
GET /api/stats/7d/trade-count
```

#### Get 7-Day Daily Statistics
```
GET /api/stats/7d/daily
```

#### Get Top Token Pairs
```
GET /api/stats/7d/top-pairs?limit={limit}
```
Query Parameters:
- `limit` (optional, default: 10): Maximum number of pairs

#### Get Top Makers
```
GET /api/stats/7d/top-makers?limit={limit}
```
Query Parameters:
- `limit` (optional, default: 10): Maximum number of makers

#### Get Token Volume
```
GET /api/stats/7d/token-volume?token_id={id}
```
Query Parameters:
- `token_id`: Token database ID

#### Get 7-Day Average Fee
```
GET /api/stats/7d/average-fee
```

#### Get Comprehensive 7-Day Statistics
```
GET /api/stats/7d/comprehensive
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": <response_data>,
  "error": null
}
```

### Error Response
```json
{
  "success": false,
  "data": null,
  "error": "Error message"
}
```

## HTTP Status Codes
- `200`: Success
- `429`: Rate limit exceeded
- `500`: Internal server error