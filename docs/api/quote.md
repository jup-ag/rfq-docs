---
title: Quote Endpoint
description: Provide competitive pricing quotes for token swaps
sidebar_position: 2
---

# Quote Endpoint

The quote endpoint is the core of the RFQ system. Jupiter sends quote requests to your webhook, and you must respond with competitive pricing within 250ms.

## Endpoint Details

**Method:** `POST`  
**Path:** `/quote`  
**Full URL:** `{baseUrl}/quote`  
**Timeout:** 250ms maximum response time

## Request Format

### Headers
```
POST /jupiter/rfq/quote HTTP/1.1
Host: your-api-endpoint.com
Content-Type: application/json
X-API-KEY: your-api-key (if configured)
x-request-timeout: 250
```

### Request Body
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

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `request_id` | string | Yes | Unique identifier for the request |
| `quote_id` | string | Yes | Unique identifier for the quote |
| `token_in` | string | Yes | Input token mint address |
| `amount` | string | Yes | Token amount in smallest unit |
| `token_out` | string | Yes | Output token mint address |
| `quoteType` | string | Yes | `"exactIn"` or `"exactOut"` |
| `protocol` | string | Yes | RFQ protocol version (e.g., "v1") |
| `taker` | string | Yes | The taker's wallet address |
| `suggested_priorization_fees` | string | No | Suggested priority fees in micro-lamports |
| `fee_bps` | number | No | Platform fee in basis points |

## Response Format

### Success Response (200 OK)

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

### Response Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `request_id` | string | Yes | Echo of the request ID |
| `quote_id` | string | Yes | Echo of the quote ID |
| `token_in` | string | Yes | Echo of the input token |
| `amount_in` | string | Yes | Input amount for the quote |
| `token_out` | string | Yes | Echo of the output token |
| `taker` | string | Yes | Echo of the taker's address |
| `quoteType` | string | Yes | Echo of the quote type |
| `protocol` | string | Yes | Echo of the protocol version |
| `amount_out` | string | Yes | Output amount you can provide |
| `maket` | string | Yes | Your market maker wallet address |
| `suggested_priorization_fees` | string | No | Echo of suggested priority fees |
| `fee_bps` | number | No | Echo of platform fee |

### No Quote Available (404 Not Found)

Return 404 when you cannot provide a quote:

```json
{
  "error": "Quote not available",
  "reason": "Insufficient liquidity"
}
```

## Swap Modes Explained

### ExactIn
User specifies exact input amount, output amount varies based on your quote.

**Example Request:**
```json
{
  "amount": "1000000",     // Exactly 1 USDC in
  "swapMode": "ExactIn"
}
```

**Example Response:**
```json
{
  "inAmount": "1000000",   // Exactly 1 USDC
  "outAmount": "4500000"   // ~0.0045 SOL out (your quote)
}
```

### ExactOut
User specifies exact output amount, input amount varies based on your quote.

**Example Request:**
```json
{
  "amount": "1000000000",  // Exactly 1 SOL out
  "swapMode": "ExactOut"
}
```

**Example Response:**
```json
{
  "inAmount": "220000000", // ~220 USDC in (your quote)
  "outAmount": "1000000000" // Exactly 1 SOL
}
```

## Fee Handling

### Platform Fees
Jupiter charges dynamic fees that are included in the quote request. **You don't need to account for these fees** - they're handled automatically by the RFQ system.

```javascript
// ❌ Don't do this - fees are handled automatically
const outputWithFee = baseOutput * (1 - platformFeeBps / 10000);

// ✅ Do this - quote your best price
const outputAmount = calculateBestPrice(inputAmount, inputMint, outputMint);
```

### Fee Application Example
For a 1 SOL → 1000 USDC quote with 100 bps (1%) fee:
- Your quote: `outAmount: "1000000000"` (1000 USDC)
- Actual transfer: 990 USDC to user, 10 USDC as fee
- You only provide 990 USDC, not 1000 USDC

**Next:** [Swap Endpoint](./swap) - Learn how to handle swap execution requests
