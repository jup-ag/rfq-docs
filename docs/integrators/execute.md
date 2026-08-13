---
title: Execute Endpoint
description: Submit a taker-signed transaction for the market maker to fill
sidebar_position: 3
---

# Execute Endpoint

`/execute` takes the transaction from [`/order`](./order) — now signed by the taker — and hands it
to the market maker, who adds the final signature and submits it to Solana.

**Method:** `POST`
**URL:** `https://api.jup.ag/swap/v2/jupiterz/execute`

## Request

```bash
curl -X POST 'https://api.jup.ag/swap/v2/jupiterz/execute' \
  -H 'x-api-key: your-api-key' \
  -H 'Content-Type: application/json' \
  -d '{
    "requestId": "629bddf3-0038-43a6-8956-f5433d6b1191",
    "quoteId": "59db3e19-c7b0-4753-a8aa-206701004498",
    "transaction": "AgAAAAAAAAAA..."
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `requestId` | string | Yes | `requestId` from the order response, unchanged |
| `quoteId` | string | Yes | `quoteId` from the order response, unchanged |
| `transaction` | string | Yes | The order's `transaction`, signed by the taker and re-encoded as base64 |

Sign the transaction as-is. Rebuilding it, reordering instructions or changing amounts invalidates
it — the market maker verifies the transaction it originally quoted before signing.

## Response

```json
{
  "quoteId": "59db3e19-c7b0-4753-a8aa-206701004498",
  "state": "confirmed",
  "signature": "5h7...Xk2"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `quoteId` | string | Echo of the quote ID |
| `state` | string | Outcome of the swap. See below |
| `signature` | string \| null | Transaction signature, once the fill is known |

### States

| State | `signature` | Meaning |
|-------|-------------|---------|
| `confirmed` | Present | The swap landed on-chain. Terminal |
| `accepted` | `null` | The market maker accepted and submitted the swap, but on-chain confirmation is still pending |
| `rejected` | `null` | The market maker declined to fill |
| `invalid` | `null` | The transaction did not pass validation |
| `failed` | `null` | Network error or timeout reaching the market maker |

:::note
A rejected or failed swap still returns `200 OK` with the state in the body — check `state`, not
just the HTTP status.
:::

### Pending confirmations

An `accepted` response means the transaction was submitted but not yet seen as confirmed. Calling
`/execute` again with the same `requestId` is safe: it does not re-execute the swap, it re-checks
the existing one and returns `confirmed` with the signature once it lands.

```ts
async function executeAndConfirm(body, headers) {
  for (let i = 0; i < 10; i++) {
    const res = await fetch('https://api.jup.ag/swap/v2/jupiterz/execute', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(r => r.json());

    if (res.state !== 'accepted') return res; // confirmed, rejected, invalid or failed
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error('confirmation timed out');
}
```

## Errors

| Status | `errorCode` | Cause |
|--------|-------------|-------|
| `400` | `QUOTE_EXPIRED` | The quote's `expireAt` passed before execution |
| `400` | — | Malformed `requestId`, `quoteId` or transaction |
| `401` | — | Missing or invalid `x-api-key` |
| `404` | — | No quote matching this `requestId` |

See the [overview](./overview#errors) for the full error format.
