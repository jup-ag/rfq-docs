---
title: Permissioned Tokens Endpoint
description: Advertise tokens you fill just-in-time, minting or burning alongside the fill
sidebar_position: 5
---

# Permissioned Tokens Endpoint

This endpoint is **optional**. It lets you advertise tokens you support but cannot hold as ordinary
inventory — tokenised RWAs such as Ondo or xStocks, where settling a swap means minting or burning
the token atomically with the fill rather than transferring from a pre-funded balance.

Jupiter cannot simulate those fills before you build them, so the mints listed here are flagged
`permissioned` and Jupiter relaxes the checks that depend on simulation. Everything else about your
integration stays the same.

## Endpoint Details

**Method:** `GET`
**Path:** `/permissioned-tokens`
**Full URL:** `{baseUrl}/permissioned-tokens`

It is called by the same token sync that calls [`/tokens`](./tokens) — every 10 minutes, with a
5 second timeout per call, and only for production-QoS webhooks.

## Request

### Headers
```
GET /jupiter/rfq/permissioned-tokens HTTP/1.1
Host: your-api-endpoint.com
X-API-KEY: your-api-key (if configured)
```

### Query Parameters
None required.

## Response

### Success Response (200 OK)

A JSON array of mint addresses — same shape as `/tokens`.

```json
[
  "<permissioned mint address>",
  "<permissioned mint address>"
]
```

### If you don't implement it

The call is best-effort. Any non-200 status, timeout, or unparseable body is treated as an **empty
list** and the sync continues with your `/tokens` response. Existing integrations need no changes.

:::note Not symmetrical with `/tokens`
A failing `/tokens` call aborts the whole sync for your webhook, leaving your previous list in place.
A failing `/permissioned-tokens` call does not — it just means no mint is flagged permissioned on
that pass.
:::

## How the two lists combine

- Your supported set is the **union** of `/tokens` and `/permissioned-tokens`, sorted and deduped.
  You do **not** need to repeat permissioned mints in `/tokens`.
- A mint is flagged permissioned if, and only if, it appears in `/permissioned-tokens` on that pass.
  Listing it in both leaves it permissioned.
- Every address in either list must resolve on-chain. On first sight Jupiter reads the owning token
  program, decimals, and metadata over RPC; an address that doesn't resolve aborts the sync for your
  webhook.
- If the union is shorter than what Jupiter currently has stored for you, the stored list is dropped
  and rebuilt from the new one.

:::warning Moving a mint between the two lists is a no-op
Jupiter hashes the sorted union to detect changes and skips the pass entirely when the hash is
unchanged. Moving a mint from `/tokens` to `/permissioned-tokens` leaves the union identical, so the
`permissioned` flag will **not** flip. Introduce the mint in the same pass as another change to your
token set, or ask your Jupiter contact to force a re-sync.
:::

## What changes once a mint is permissioned

Both apply as soon as either side of a quoted pair is permissioned:

- **No quote-time simulation.** Normally Jupiter simulates the candidate fill to estimate its compute
  budget. For permissioned pairs it skips straight to the configured maximum compute unit limit
  (200,000 by default), so your fill must complete within that budget. The upside is that your quote
  is never dropped for a simulation failure; the downside is that a fill that would have failed in
  simulation now fails on-chain and counts against your fill rate.
- **No taker balance pre-check.** Jupiter's `/quote` balance attribution and the `/swap` pre-flight
  balance check are both skipped, so the taker's input balance is only enforced on-chain by the fill
  instruction. If you determine the taker cannot pay, reject the swap with `InsufficientBalance`;
  Jupiter re-checks the balance itself and only penalises rejections it finds dishonest.

## Filling atomically

Jupiter builds the fill transaction and the taker signs it before it reaches your `/swap` endpoint.
By then the message is fixed — you sign as maker and fee payer and submit it. The mint or burn
therefore has to be landed atomically alongside that transaction by your own execution
infrastructure, not appended to it.

## Checklist

- [ ] Serve `GET /permissioned-tokens` on the same base URL, honouring the same `X-API-KEY`.
- [ ] Return only mints you can mint/burn on demand; keep everything else in `/tokens`.
- [ ] Quote them only when you can settle within the 200,000 CU fill budget.
- [ ] Handle a taker who cannot pay by rejecting with `InsufficientBalance`.

---

**Next:** [Quote Endpoint](./quote) - Learn how to handle quote requests
