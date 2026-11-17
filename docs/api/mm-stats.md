---
title: Market Maker Stats
description: Check your fill rate and whether your quote won a request
sidebar_position: 6
---

# Market Maker Stats

The other endpoints in this section are served by your webhook. These two are served **by Jupiter**,
for you to call: one returns your fill rate, the other tells you whether your quote won a request
and how the swap ended.

| Endpoint | Method | Returns |
|----------|--------|---------|
| [`/mm-stats/{mm_secret_uuid}/fill-rate`](#fill-rate) | `GET` | Your confirmed and failed swaps over the last 30 days |
| [`/mm-stats/{mm_secret_uuid}/winning-quote/{request_uuid}`](#winning-quote) | `GET` | Whether your quote won a request, and how its swap ended |

## Access

- **Base URL:** `https://<rfq-api-host>/v1`
- **Authentication:** none. Your MM secret, part of the path, identifies you.
- **MM secret:** a UUID Jupiter assigns to your webhook. Ask your Jupiter contact for it. A newly
  assigned secret works within 30 seconds.
- Lookups work whatever your webhook's status, including while it is suspended.

:::warning Keep your secret private
Anyone who has your MM secret can call these endpoints as you.
:::

## Fill rate

**Method:** `GET`
**URL:** `https://<rfq-api-host>/v1/mm-stats/{mm_secret_uuid}/fill-rate`

Your swap outcomes over a rolling 30-day window, counted by when each swap resolved.

### Request

```bash
curl 'https://<rfq-api-host>/v1/mm-stats/<your-mm-secret>/fill-rate'
```

### Response

```json
{
  "confirmedSwaps": 97,
  "failedSwaps": 3
}
```

| Field | Type | Description |
|-------|------|-------------|
| `confirmedSwaps` | number | Swaps that landed on-chain |
| `failedSwaps` | number | Swaps that ended `failed`, `dropped` or `rejected` |

Your fill rate is `confirmedSwaps / (confirmedSwaps + failedSwaps)`. Both are `0` if none of your
swaps resolved in the window. Swaps still in progress, or that ended in any other state, count in
neither.

## Winning quote

**Method:** `GET`
**URL:** `https://<rfq-api-host>/v1/mm-stats/{mm_secret_uuid}/winning-quote/{request_uuid}`

Tells you whether the taker executed your quote for a request, and how that swap ended.
`request_uuid` is the request ID Jupiter sent you in the [`/quote`](./quote) request.

### Request

```bash
curl 'https://<rfq-api-host>/v1/mm-stats/<your-mm-secret>/winning-quote/629bddf3-0038-43a6-8956-f5433d6b1191'
```

### Response

```json
{
  "requestId": "629bddf3-0038-43a6-8956-f5433d6b1191",
  "isWinner": true,
  "state": {
    "status": "confirmed",
    "signature": "5K6CqVweTk4t9K6Xfa1gw7D9rS4GeAa8Z67e2q8Mi7f8QwexqTmtLnZgNeBe93PaRtt8beijqV9t7rp7C7yGfzkXGy2yFbF"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `requestId` | string | Echo of `request_uuid` |
| `isWinner` | boolean | `true` if the taker executed your quote. It does not mean the swap landed — check `state` |
| `state.status` | string | `pending`, `confirmed` or `failed`. See below |
| `state.signature` | string | Fill transaction signature. Only present when `status` is `confirmed` |

When `isWinner` is `false`, another maker won and `state` describes their swap, not yours.

### Statuses

| `status` | Meaning |
|----------|---------|
| `pending` | The swap is still settling. Ask again later |
| `confirmed` | The swap landed on-chain. `signature` is set |
| `failed` | The swap did not land |

### Too early (425)

You get an answer only once a swap exists for the request and is at least 10 seconds old. Until
then the endpoint returns `425 Too Early`, with the number of seconds to wait in `Retry-After`:

```
HTTP/1.1 425 Too Early
Retry-After: 2
Content-Type: application/json

{
  "error": "winning quote queried too early or no data; debouncing requests",
  "errorCode": "TOO_EARLY"
}
```

- After a `425`, every lookup of that request ID gets `425` until `Retry-After` has passed. Polling
  faster does not help.
- A request that never led to a swap (the taker executed no quote) returns `425` indefinitely, so
  cap how long you poll.

```ts
const BASE = 'https://<rfq-api-host>/v1/mm-stats';
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function waitForWinningQuote(mmSecret: string, requestId: string) {
  for (let attempt = 0; attempt < 30; attempt++) {
    const res = await fetch(`${BASE}/${mmSecret}/winning-quote/${requestId}`);
    if (res.status === 425) {
      await sleep(Number(res.headers.get('retry-after') ?? 2) * 1000);
      continue;
    }
    if (!res.ok) throw new Error(`winning-quote: HTTP ${res.status}`);
    const body = await res.json();
    if (body.state.status !== 'pending') return body; // confirmed or failed
    await sleep(2000);
  }
  return null; // no swap for this request, or still settling
}
```

## Errors

Errors use one JSON body. `errorCode` is `null` unless listed below.

```json
{
  "error": "Webhook not found by secret id",
  "errorCode": null
}
```

| Status | `errorCode` | Cause |
|--------|-------------|-------|
| `400` | — | `mm_secret_uuid` or `request_uuid` is not a valid UUID |
| `404` | — | No webhook has this MM secret |
| `425` | `TOO_EARLY` | Winning quote only: no swap for this request yet, or it is under 10 seconds old |
| `500` | — | Server-side failure |

---

**Next:** [Testing](../testing/overview) - Learn how to test your webhook implementation
