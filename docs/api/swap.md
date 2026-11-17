---
title: Swap Endpoint
description: Execute verified swap transactions on the Solana network
sidebar_position: 3
---

# Swap Endpoint

The swap endpoint handles the execution of verified swap requests. When a user accepts a quote, Jupiter sends the swap request to your webhook with a prepared transaction that you must verify, sign, and submit to the Solana network.

## Endpoint Details

**Method:** `POST`  
**Path:** `/swap`  
**Full URL:** `{baseUrl}/swap`  
**Timeout:** 25 seconds maximum response time

## Request Format

### Headers
```
POST /jupiter/rfq/swap HTTP/1.1
Host: your-api-endpoint.com
Content-Type: application/json
X-API-KEY: your-api-key (if configured)
```

### Request Body
```json
{
  "request_id": "629bddf3-0038-43a6-8956-f5433d6b1191",
  "quote_id": "59db3e19-c7b0-4753-a8aa-206701004498",
  "transaction": "base64-encoded-transaction-data"
}
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `request_id` | string | Yes | Unique identifier for the request |
| `quote_id` | string | Yes | Unique identifier for the quote |
| `transaction` | string | Yes | Base64-encoded transaction data |

## Response Format

### Success Response (200 OK)

```json
{
  "quote_id": "59db3e19-c7b0-4753-a8aa-206701004498",
  "state": "accepted",
  "tx_signature": "base64-encoded-transaction-signature",
  "rejection_reason": null
}
```

### Response Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `quote_id` | string | Yes | Echo of the quote ID |
| `state` | string | Yes | `"accepted"` or `"rejected"` |
| `tx_signature` | string | Yes | Base64-encoded transaction signature |
| `rejection_reason` | string | No | Reason for rejection, if applicable |

---

**Next:** [Market Maker Stats](./mm-stats) - Check your fill rate and whether your quote won
