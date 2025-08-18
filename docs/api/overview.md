---
title: API Overview
description: Complete specification for Jupiter RFQ webhook endpoints
sidebar_position: 1
---

# API Overview

The Jupiter RFQ Webhook API consists of three main endpoints that your webhook must implement. This section provides detailed specifications for each endpoint.

## Base Requirements

### Endpoint Structure
Your webhook will be registered with a base URL, and Jupiter will append specific paths:

```
Base URL: https://your-api-endpoint.com/jupiter/rfq
```

Required endpoints:
- `GET {baseUrl}/tokens` - Token support advertisement
- `POST {baseUrl}/quote` - Quote generation  
- `POST {baseUrl}/swap` - Swap execution

### Authentication
If your webhook requires authentication, provide an API key during registration. Jupiter will include it in requests as:
```
X-API-KEY: your-provided-api-key
```

### Content Type
All requests and responses use `application/json` content type.

### Timeout Requirements
- **Quote requests**: 250ms maximum response time
- **Swap requests**: 25 seconds maximum response time

## Request Headers

Jupiter includes these headers in all requests:

| Header | Description |
|--------|-------------|
| `Content-Type` | `application/json` |
| `X-API-KEY` | Your API key (if provided during registration) |
| `x-request-start` | Millisecond timestamp when request was sent |
| `x-request-timeout` | Request timeout in milliseconds (250ms for quotes) |

## HTTP Status Codes

### Successful Responses
- **`200 OK`** - Request successful, returning data
- **`404 Not Found`** - No quote available for this request

### Error Responses
- **`400 Bad Request`** - Malformed request parameters
- **`401 Unauthorized`** - Missing or invalid API key
- **`429 Too Many Requests`** - Rate limit exceeded
- **`500 Internal Server Error`** - Server error occurred
- **`503 Service Unavailable`** - Temporarily unable to serve requests

:::warning Performance Requirements
Webhooks that consistently return 5xx errors or fail to respond within timeout limits will be temporarily suspended from receiving requests.
:::

## Data Types and Formats

### Token Addresses
All token addresses are base58-encoded Solana public keys:
```
"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" // USDC
"So11111111111111111111111111111111111111112"  // SOL (Native)
```

### Amount Representation
All token amounts are represented as strings in their smallest unit (considering token decimals):
```json
{
  "amount": "1000000",    // 1 USDC (6 decimals)
  "amount": "1000000000"  // 1 SOL (9 decimals)
}
```

### Swap Modes
- **`ExactIn`** - Exact input amount, variable output
- **`ExactOut`** - Variable input amount, exact output

## Validation Requirements

### Input Validation
Always validate incoming requests:
- Token addresses are valid base58 Solana public keys
- Amounts are positive integers  
- Swap modes are valid enum values
- Required fields are present

### Output Validation
Ensure your responses match the expected format:
- All required fields are present
- Data types match specifications
- Amounts are properly formatted
- Price impacts are reasonable

## OpenAPI Specification

Complete OpenAPI documentation is available in the [GitHub repository](https://github.com/jup-ag/rfq-webhook-toolkit/tree/main/openapi). 

You can also run the sample server to explore the interactive documentation:
```bash
make run-server-example
# Visit http://localhost:8080/swagger-ui/
```

## Next Steps

Explore the detailed endpoint specifications:
- **[Tokens Endpoint](./tokens)** - Token support advertisement
- **[Quote Endpoint](./quote)** - Quote request/response format
- **[Swap Endpoint](./swap)** - Swap execution details
