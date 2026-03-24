---
title: Webhook Implementation
description: Step-by-step guide to implementing JupiterZ webhook endpoints
sidebar_position: 2
---

# Webhook Implementation

This guide walks you through implementing the required webhook endpoints for JupiterZ integration.

## Endpoint Requirements

### 1. Tokens Endpoint (`GET /tokens`)

This endpoint advertises the tokens your market maker supports. Jupiter calls this endpoint every 10 minutes to refresh the token list.

**Response Format:**
```json
[
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  "So11111111111111111111111111111111111111112",  // SOL
  "mSoLzYCxHdYgdziU2hgzX6qHJwXaTNFRGZQ7CWt5qKZ"   // mSOL
]
```

:::tip
Only advertise tokens for which you have sufficient liquidity and can maintain the required 95% fulfillment rate.
:::

### 2. Quote Endpoint (`POST /quote`)

Receives quote requests and returns competitive pricing.

**Request Format:**
```json
{
  "request_id": "629bddf3-0038-43a6-8956-f5433d6b1191",
  "quote_id": "59db3e19-c7b0-4753-a8aa-206701004498",
  "token_in": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "amount": "1000000",
  "token_out": "So11111111111111111111111111111111111111112",
  "quoteType": "exactIn",
  "protocol": "v1",
  "taker": "5v2Vd71VoJ1wZhz1PkhTY48mrJwS6wF4LfvDbYPnJ3bc",
  "suggested_priorization_fees": "10000",
  "fee_bps": 1
}
```

**Response Format:**
```json
{
  "request_id": "629bddf3-0038-43a6-8956-f5433d6b1191",
  "quote_id": "59db3e19-c7b0-4753-a8aa-206701004498",
  "token_in": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "amount_in": "1000000",
  "token_out": "So11111111111111111111111111111111111111112",
  "taker": "5v2Vd71VoJ1wZhz1PkhTY48mrJwS6wF4LfvDbYPnJ3bc",
  "quoteType": "exactIn",
  "protocol": "v1",
  "amount_out": "1000000000",
  "maket": "8iJxVDtFxnWpdCvdrgNDSXigxHo9vLf7KCS1pNKrs5Nh",
  "suggested_priorization_fees": "10000",
  "fee_bps": 1
}
```

### 3. Swap Endpoint (`POST /swap`)

Receives swap execution requests with transaction data.

**Request Format:**
```json
{
  "request_id": "629bddf3-0038-43a6-8956-f5433d6b1191",
  "quote_id": "59db3e19-c7b0-4753-a8aa-206701004498",
  "transaction": "base64-encoded-transaction-data",
}
```

**Response Format:**
```json
{
  "quote_id": "59db3e19-c7b0-4753-a8aa-206701004498",
  "state": "accepted/rejected",
  "tx_signature": "base64-encoded-transaction-data",
  "rejection_reason": "Option: String"
}
```

## HTTP Status Codes

### Successful Responses
- **`200 OK`** - Request successful, returning quote/execution
- **`404 Not Found`** - No quote available (unsupported pair/size)

### Error Responses  
- **`400 Bad Request`** - Malformed request
- **`401 Unauthorized`** - Invalid/missing API key
- **`50x Server Errors`** - Webhook offline/unavailable

## Sample Implementation

A complete sample server implementation is available in the [server-example](https://github.com/jup-ag/rfq-webhook-toolkit/tree/main/server-example) directory of the toolkit repository.

To run the sample server:

```bash
make run-server-example
```

Then visit `http://localhost:8080/swagger-ui/` to explore the API documentation.

## Next Steps

- **[API Reference](../api/overview)** - Detailed API specifications
- **[Testing](../testing/overview)** - Test your implementation
- **[Deployment](./deployment)** - Production deployment guide
