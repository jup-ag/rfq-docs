---
title: Tokens Endpoint
description: Advertise supported token pairs to Jupiter
sidebar_position: 4
---

# Tokens Endpoint

The tokens endpoint allows market makers to advertise which token pairs they support. Jupiter calls this endpoint every 10 minutes to refresh the list of available tokens for each webhook.

## Endpoint Details

**Method:** `GET`  
**Path:** `/tokens`  
**Full URL:** `{baseUrl}/tokens`

## Request

### Headers
```
GET /jupiter/rfq/tokens HTTP/1.1
Host: your-api-endpoint.com
X-API-KEY: your-api-key (if configured)
```

### Query Parameters
None required.

## Response

### Success Response (200 OK)

Returns a JSON array of token mint addresses that your market maker supports.

**Response Format:**
```json
[
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "So11111111111111111111111111111111111111112", 
  "mSoLzYCxHdYgdziU2hgzX6qHJwXaTNFRGZQ7CWt5qKZ",
  "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj"
]
```

### Example Response
```json
[
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  "So11111111111111111111111111111111111111112",  // SOL (Native)
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",  // USDT  
  "mSoLzYCxHdYgdziU2hgzX6qHJwXaTNFRGZQ7CWt5qKZ",   // mSOL
  "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj"    // stSOL
]
```

## Token Requirements

### Supported Token Types
- **Native SOL**: Use the standard SOL mint address
- **SPL Tokens**: Any valid SPL token mint address
- **Wrapped SOL (WSOL)**: Required for SOL swap processing

:::important Native SOL Support
While JupiterZ supports native SOL for users, market makers should use WSOL (Wrapped SOL) in their systems. The order engine automatically handles SOL wrapping/unwrapping.
:::

:::tip Tokens you mint or burn to fill
Tokenised RWAs such as Ondo or xStocks, where you settle by minting or burning rather than from
inventory, belong in [`/permissioned-tokens`](./permissioned-tokens) instead.
:::

### Token Address Validation
All token addresses must be:
- Valid base58-encoded Solana public keys
- Existing token mints on Solana mainnet
- Tokens you can actually provide liquidity for

### Common Token Addresses
```javascript
const COMMON_TOKENS = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", 
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  mSOL: "mSoLzYCxHdYgdziU2hgzX6qHJwXaTNFRGZQ7CWt5qKZ",
  stSOL: "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj",
  jitoSOL: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
  BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  JUP: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"
};
```

---

**Next:** [Permissioned Tokens Endpoint](./permissioned-tokens) - Advertise tokens you fill just-in-time
