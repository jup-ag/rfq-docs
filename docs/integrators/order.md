---
title: Order Endpoints
description: Request a quote and an unsigned transaction from JupiterZ market makers
sidebar_position: 2
---

# Order Endpoints

`/order` asks every eligible market maker for a price and returns the best one, along with an
unsigned transaction ready for the taker to sign.

**Method:** `GET`
**URL:** `https://api.jup.ag/swap/v2/jupiterz/order`

## Request

```bash
curl -G 'https://api.jup.ag/swap/v2/jupiterz/order' \
  -H 'x-api-key: your-api-key' \
  -d inputMint=So11111111111111111111111111111111111111112 \
  -d outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v \
  -d amount=1000000000 \
  -d taker=5v2Vd71VoJ1wZhz1PkhTY48mrJwS6wF4LfvDbYPnJ3bc \
  -d swapMode=ExactIn
```

### Query parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `inputMint` | string | Yes | Input token mint address |
| `outputMint` | string | Yes | Output token mint address |
| `amount` | string | Yes | Amount in the token's smallest unit. Input amount for `ExactIn`, output amount for `ExactOut` |
| `taker` | string | No | Taker wallet address. **Required to receive a transaction** — see [Indicative quotes](#indicative-quotes) |
| `swapMode` | string | No | `ExactIn` (default) or `ExactOut` |
| `version` | string | No | RFQ protocol version. Defaults to `v1` |
| `feeBps` | number | No | Market maker fee in basis points (max `10000`) |
| `isWsol` | boolean | No | Set when the swap involves wSOL rather than native SOL |
| `receiver` | string | No | Address receiving the output tokens, when different from the taker |
| `ataAccountPayer` | string | No | Address paying for Associated Token Account creation |
| `inputTokenAccount` | string | No | Existing taker-owned input token account. Bypasses ATA derivation |
| `outputTokenAccount` | string | No | Existing taker-owned output token account. Bypasses ATA derivation |
| `integratorTokenAccount` | string | No | Token account that receives your integrator fee |
| `integratorFee` | number | No | Your fee in basis points (max `10000`). Requires `integratorTokenAccount` |
| `integratorFeeSide` | string | No | `input` or `output`. Defaults to the user-fixed side: `input` for `ExactIn`, `output` for `ExactOut`. Requires `integratorTokenAccount` |
| `settingsPda` | string | No | Squads V5 settings PDA. Required for [vault swaps](../integration/squads) |
| `signers` | string | No | Comma-separated signer pubkeys for Squads vault swaps. The first is the fee payer |

:::note
`swapMode` accepts `ExactIn`, `exactIn` and `exact_in` (and the `ExactOut` equivalents). Responses
always use the camelCase form: `exactIn` / `exactOut`.
:::

## Response

```json
{
  "routing": "spot",
  "requestId": "629bddf3-0038-43a6-8956-f5433d6b1191",
  "quoteId": "59db3e19-c7b0-4753-a8aa-206701004498",
  "maker": "maker2p9zXHQ5GKdZjSxLu7BfVz8YmF9oQ7TEd1rWqw",
  "provider": "MM Trading",
  "swapMode": "exactIn",
  "orderInfo": {
    "input": {
      "token": "So11111111111111111111111111111111111111112",
      "startAmount": "1000000000",
      "endAmount": "1000000000"
    },
    "output": {
      "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "startAmount": "200000000",
      "endAmount": "200000000"
    }
  },
  "transaction": "AgAAAAAAAAAA...",
  "expireAt": "1736968572"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `routing` | string | `spot` for RFQ fills |
| `requestId` | string | Identifies this quote request. Pass it to `/execute` |
| `quoteId` | string | Identifies this specific quote. Pass it to `/execute` |
| `maker` | string | Market maker wallet filling the order |
| `provider` | string | Human-readable name of the market maker |
| `swapMode` | string | `exactIn` or `exactOut` |
| `orderInfo.input` | object | Input token and amounts |
| `orderInfo.output` | object | Output token and amounts |
| `transaction` | string \| null | Base64-encoded versioned transaction to sign. `null` for indicative quotes |
| `expireAt` | string \| null | Unix timestamp (seconds) after which the transaction is no longer valid |
| `error` | string | Present only when no transaction could be built. See below |

`startAmount` and `endAmount` are equal for RFQ fills — market makers quote a firm price, so there
is no slippage range.

:::warning Quote expiry
Sign and submit before `expireAt`. Executing an expired quote returns `400` with
`errorCode: "QUOTE_EXPIRED"`.
:::

### Indicative quotes

Two cases return a price but no `transaction`, so you can display pricing before the user is ready
to trade:

- **No `taker`** — nothing to build a transaction against. `error` is omitted.
- **`taker` provided, but the transaction cannot be built** — `error` explains why:

| `error` | Meaning |
|---------|---------|
| `insufficientBalance` | The taker does not hold enough of the input token |
| `missingAtaAccount` | A token account required by the swap does not exist on-chain |

Always check that `transaction` is non-null before signing.

### No quote available

```json
{
  "error": "No quote found",
  "errorCode": "NO_QUOTE_FOUND"
}
```

Returned as `404` when no market maker quoted this pair. Fall back to another liquidity source.

## Global order

`/global-order` quotes one input mint against **up to 5 candidate output mints** and returns only
the leg worth the most in USD. Useful when you don't care which stablecoin (or wrapper) the user
ends up with — just which one pays best.

**Method:** `GET`
**URL:** `https://api.jup.ag/swap/v2/jupiterz/global-order`

Parameters are identical to `/order`, with two differences:

- `outputMint` takes a **comma-separated list** of 1–5 mints.
- `ExactIn` only.

```bash
curl -G 'https://api.jup.ag/swap/v2/jupiterz/global-order' \
  -H 'x-api-key: your-api-key' \
  -d inputMint=So11111111111111111111111111111111111111112 \
  -d outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v,Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB \
  -d amount=1000000000 \
  -d taker=5v2Vd71VoJ1wZhz1PkhTY48mrJwS6wF4LfvDbYPnJ3bc
```

The response has the same shape as `/order`. `orderInfo.output.token` tells you which mint won, and
`requestId` identifies that winning leg — pass it to `/execute` unchanged.

Passing zero mints, or more than 5, returns `400`.

---

**Next:** [Execute Endpoint](./execute) — submit the signed transaction
