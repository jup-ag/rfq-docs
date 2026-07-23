# gRPC API Reference

This is the wire-level reference for RFQ v2, based on [`protos/market_maker.proto`](https://github.com/jup-ag/rfq-v2-sdk/blob/main/protos/market_maker.proto). The SDKs generate their types from this file; the ingestion service implements the other side of it. The proto shipped with the SDK and the one in the service are semantically identical (comment differences only).

The proto uses **`proto2` syntax**. Every field is `required` unless noted `optional` or `repeated`. In proto2, omitting a `required` field is a serialization error on both ends, which is why the builders enforce presence before letting you send a quote.

## Service definition

```protobuf
service MarketMakerIngestionService {
    rpc GetLastSequenceNumber(SequenceNumberRequest) returns (SequenceNumberResponse);
    rpc GetAllOrderbooks(GetAllOrderbooksRequest) returns (GetAllOrderbooksResponse);
    rpc StreamQuotes(stream MarketMakerQuote) returns (stream QuoteUpdate);   // bidirectional
    rpc StreamSwap(stream MarketMakerSwap) returns (stream SwapUpdate);       // bidirectional
    rpc GetQuotes(GetQuotesRequest) returns (GetQuotesResponse);
}
```

| RPC | Kind | Purpose |
|---|---|---|
| `StreamQuotes` | bidi stream | Submit orderbooks; receive `QuoteUpdate` acks. |
| `StreamSwap` | bidi stream | Receive swap notifications; return co-signed transactions. |
| `GetLastSequenceNumber` | unary | Fetch your last stored sequence number (for resync). |
| `GetAllOrderbooks` | unary | Snapshot of all active orderbooks (used by Jupiter's quote layer). |
| `GetQuotes` | unary | Fetch quotes for one token pair. |

## Streaming RPCs

### StreamQuotes

You send `MarketMakerQuote` messages; the server replies with `QuoteUpdate`.

**Client → Server: `MarketMakerQuote`**

```protobuf
message MarketMakerQuote {
    required uint64 timestamp = 1;           // Unix time in microseconds
    required uint64 sequence_number = 2;     // strictly increasing per maker
    required uint64 quote_expiry_time = 3;   // validity DURATION in SECONDS (min 10)
    required string maker_id = 4;            // your maker id (provider)
    required string maker_address = 5;       // your Solana address (base58)
    required uint64 lot_size_base = 6;       // 10^(base_decimals - quote_decimals)
    required Cluster cluster = 7;            // mainnet
    required TokenPair token_pair = 8;
    repeated PriceLevel bid_levels = 9;      // up to 5 kept, price descending
    repeated PriceLevel ask_levels = 10;     // up to 5 kept, price ascending
}
```

**Server → Client: `QuoteUpdate`**

```protobuf
message QuoteUpdate {
    required UpdateType update_type = 1;
    optional string status_message = 2;   // present (with the reason) on REJECTED
}

enum UpdateType {
    UPDATE_TYPE_UNSPECIFIED = 0;
    UPDATE_TYPE_NEW = 1;
    UPDATE_TYPE_UPDATED = 2;   // your quote was accepted and stored
    UPDATE_TYPE_EXPIRED = 3;
    UPDATE_TYPE_REJECTED = 4;  // validation failed — read status_message
}
```

:::tip Only `UPDATED` and `REJECTED` are emitted
In practice the server acknowledges an accepted quote with `UPDATE_TYPE_UPDATED` and reports failures with `UPDATE_TYPE_REJECTED` (plus a human-readable `status_message`). `NEW` and `EXPIRED` exist in the enum but are not sent on the stream — expiry happens silently server-side. Treat `UPDATED` as success; always read `status_message` on `REJECTED`.
:::

:::warning Drain the response stream
The server sends a `QuoteUpdate` for each quote. If you don't consume these, gRPC flow-control back-pressure builds up and your stream is dropped. Read pending updates between sends — see [Drain the acknowledgements](./sdk-integration.md#drain-the-acknowledgements).
:::

**Field reference**

| Field | Type | Meaning |
|---|---|---|
| `timestamp` | uint64 | Current Unix time in **microseconds**. |
| `sequence_number` | uint64 | Monotonic per maker; must exceed the last accepted value. |
| `quote_expiry_time` | uint64 | Validity **duration in seconds** (minimum 10 by default). |
| `maker_id` | string | Your maker id. Quotes are keyed under this string. |
| `maker_address` | string | Your Solana wallet (base58); must hold ATAs for both tokens. |
| `lot_size_base` | uint64 | Must equal `10^(base_decimals - quote_decimals)`. |
| `cluster` | Cluster | `CLUSTER_MAINNET`. |
| `token_pair` | TokenPair | Base and quote token definitions. |
| `bid_levels` / `ask_levels` | PriceLevel[] | Price levels; top 5 per side are kept. |

### StreamSwap

The server sends `SwapUpdate`; you reply with `MarketMakerSwap`.

**Server → Client: `SwapUpdate`**

```protobuf
message SwapUpdate {
    required SwapMessageType message_type = 1;
    optional string swap_uuid = 2;              // SWAP_AVAILABLE, TRANSACTION_CONFIRMED
    optional string unsigned_transaction = 3;   // SWAP_AVAILABLE (base64, already taker-signed)
    optional string transaction_signature = 4;  // TRANSACTION_CONFIRMED
    optional string status_message = 5;         // CONNECTION_READY, ERROR, PONG
}
```

**Client → Server: `MarketMakerSwap`**

```protobuf
message MarketMakerSwap {
    required SwapMessageType message_type = 1;
    required string swap_uuid = 2;
    required string signed_transaction = 3;   // base64, co-signed by the maker
}
```

**Message types**

```protobuf
enum SwapMessageType {
    SWAP_MESSAGE_TYPE_PING = 0;
    SWAP_MESSAGE_TYPE_PONG = 1;
    SWAP_MESSAGE_TYPE_CONNECTION_READY = 2;
    SWAP_MESSAGE_TYPE_SWAP_AVAILABLE = 3;
    SWAP_MESSAGE_TYPE_SWAP_SUBMIT = 4;
    SWAP_MESSAGE_TYPE_TRANSACTION_CONFIRMED = 5;
    SWAP_MESSAGE_TYPE_ERROR = 6;
}
```

**Swap lifecycle**

1. **`CONNECTION_READY`** (server → you) — sent right after you open the stream.
2. **`SWAP_AVAILABLE`** (server → you) — a user is trading against your quote. Carries `swap_uuid` and `unsigned_transaction` (base64, already taker-signed at signer index 0).
3. **`SWAP_SUBMIT`** (you → server) — return `swap_uuid` and your co-signed `signed_transaction` (base64) within the deadline (default 10s). Sign at signer index 1.
4. **`TRANSACTION_CONFIRMED`** (server → you) — the fill was submitted; carries `swap_uuid` and `transaction_signature`.
5. **`ERROR`** (server → you) — something failed; see `status_message`.

**Ping/pong:** you send `PING` (message type 0); the server replies `PONG` (message type 1, with `status_message` `"Pong"`). The server never initiates an application-level ping. This is separate from HTTP/2 transport keep-alive, which the SDK configures automatically.

See [SDK Integration](./sdk-integration.md#handling-swaps-last-look) and [Last Look & Maker Safety](./last-look-and-safety.md) for the signing and validation details.

## Unary RPCs

### GetLastSequenceNumber

Fetch your last stored sequence number so you can resume after a reconnect.

```protobuf
message SequenceNumberRequest {
    required string maker_id = 1;
    required string auth_token = 2;   // your API key, in the message body
}
message SequenceNumberResponse {
    required bool success = 1;
    required uint64 last_sequence_number = 2;
    required string message = 3;
}
```

Resume from `last_sequence_number + 1`. `start_streaming_with_sync_and_config` does this for you. Sequence state is held in memory by the server and resets on a server restart — always re-fetch rather than assuming a value.

### GetAllOrderbooks

Returns a snapshot of all active orderbooks. This is the read path Jupiter's quote layer uses; it authenticates via metadata (an internal token or any valid maker API key) and excludes suspended makers and expired levels.

```protobuf
message GetAllOrderbooksRequest {
    optional Cluster cluster = 1;   // filter; unset = all
}
message GetAllOrderbooksResponse {
    repeated Orderbook orderbooks = 1;
    required uint64 timestamp = 2;   // snapshot time (microseconds)
}
```

### GetQuotes

Fetch quotes for a single token pair.

```protobuf
message GetQuotesRequest {
    required TokenPair token_pair = 1;
    required string auth_token = 2;   // your API key, in the message body
}
message GetQuotesResponse {
    repeated MarketMakerQuote quotes = 1;
}
```

:::note Prefer the stream acks over `GetQuotes`
`GetQuotes` looks quotes up by your account's numeric id rather than the `maker_id` your quotes are stored under, so it commonly returns an empty list. Rely on the `QuoteUpdate` acknowledgements from `StreamQuotes` to confirm your quotes were accepted, and use `GetAllOrderbooks` if you need to see stored orderbooks.
:::

## Message types

### Token

```protobuf
message Token {
    required string address = 1;    // mint address
    required uint32 decimals = 2;   // e.g. 9 for SOL, 6 for USDC
    required string symbol = 3;     // e.g. "SOL"
    required string owner = 4;      // token program that owns the mint
}
```

`owner` is the **token program** (the SPL Token program `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA` for standard tokens, or the Token-2022 program), not a wallet.

### TokenPair

```protobuf
message TokenPair {
    required Token base_token = 1;   // the token being traded
    required Token quote_token = 2;  // the token it is priced in
}
```

For SOL/USDC: base = SOL (9 decimals), quote = USDC (6 decimals); price is USDC per SOL.

### PriceLevel

```protobuf
message PriceLevel {
    required uint64 volume = 1;  // base-token atoms
    required uint64 price = 2;   // quote atoms per WHOLE base token
}
```

Both are raw integers with **no decimal scaling by the SDK** — you encode them (see below). The proto comment on these fields that mentions "string" is stale; the fields are `uint64`.

### Orderbook (returned by GetAllOrderbooks)

```protobuf
message Orderbook {
    required TokenPair token_pair = 1;
    repeated PriceLevel bid_levels = 2;  // highest price first
    repeated PriceLevel ask_levels = 3;  // lowest price first
    required uint64 last_updated = 4;     // microseconds
    required string maker_address = 5;
    required uint64 expiry_time = 6;
    required uint64 lot_size_base = 7;
}
```

### Cluster

```protobuf
enum Cluster {
    CLUSTER_UNSPECIFIED = 0;
    CLUSTER_MAINNET = 1;
    CLUSTER_DEVNET = 2;
}
```

Use `CLUSTER_MAINNET`. (The server does not currently use this field to route quotes.)

## Encoding

The SDK does **no** decimal scaling — you supply raw integer atoms. The rules:

| Value | Encoding |
|---|---|
| **volume** | base-token atoms = human amount × 10^(base_decimals) |
| **price** | quote atoms per **whole** base token = human price × 10^(quote_decimals) |
| **timestamp** | Unix time in **microseconds** |
| **quote_expiry_time** | validity duration in **seconds** (minimum 10) |
| **lot_size_base** | 10^(base_decimals - quote_decimals) |
| **transactions** | **base64** (both `unsigned_transaction` and `signed_transaction`) |

### Worked example — SOL/USDC

SOL is the base (9 decimals); USDC is the quote (6 decimals). To quote **1 SOL at 153.45 USDC**:

- `volume` = 1 × 10^9 = **1_000_000_000** (lamports)
- `price` = 153.45 × 10^6 = **153_450_000** (USDC atoms per whole SOL)
- `lot_size_base` = 10^(9 - 6) = **1000**

The price formula, generally:

```
price = human_price_in_quote_per_base × 10^(quote_decimals)
```

:::warning `quote_expiry_time` is seconds, not microseconds
Send a value in **seconds** (≥ 10). With the SDK, use `expiry_time_secs(n)`. Do not use `expiry_time_micros()` or the builder default (`30_000_000`) — the server reads the field as seconds. See the [expiry warning](./sdk-integration.md#building-and-sending-quotes).
:::

:::warning `lot_size_base` when quote decimals ≥ base decimals
`10^(base_decimals - quote_decimals)` uses saturating subtraction on the server, so when the quote token has more (or equal) decimals than the base, `lot_size_base` is **1**. The value you send must match exactly or the quote is rejected.
:::

The on-chain fill uses a **different** representation (`px_ticks`/`qty_lots` with `tick_size_qpb`) — do not confuse the gRPC `price` with the on-chain tick price. See [On-chain fill encoding](./last-look-and-safety.md#on-chain-fill-encoding-vs-grpc-quote-encoding).

## Authentication

Authentication uses an **API key** issued by Jupiter. It is **not a JWT**, and there is no `Bearer` scheme — the raw key is used as-is.

- **Streaming RPCs (`StreamQuotes`, `StreamSwap`) and `GetAllOrderbooks`** authenticate via gRPC **metadata**. The server accepts the key in either the `authorization` or `x-api-key` header. The SDK sends it as `x-api-key` when you call `with_auth_token(...)`.
- **`GetQuotes` and `GetLastSequenceNumber`** authenticate via the `auth_token` **field inside the request message** (the SDK fills this from the `auth_token` you pass to those methods).

```
# metadata for streams / GetAllOrderbooks — raw key, NO "Bearer" prefix
x-api-key: <your-api-key>
```

:::danger Do not send `Bearer <key>`
The server matches the header value against your API key by exact string equality. Prefixing it with `Bearer ` makes the lookup key `"Bearer <key>"`, which will not match — authentication fails. Send the raw key.
:::

Your API key is bound to your account (`provider`, `address`, and status). The server does not separately verify that the `maker_id` inside a quote matches your account, but it does record and use your `maker_address` — keep it consistent.

## Server-side validation

A quote is only stored if it passes these checks; otherwise you get a `QuoteUpdate` with `UPDATE_TYPE_REJECTED` and a `status_message` (validation failures come back as rejections on the stream, **not** as gRPC errors).

**Pre-checks (before field validation):**

1. Your account must not be **suspended** by the [circuit breaker](./lifecycle-and-circuit-breaker.md), and must not be `offline`.
2. Your status (QoS) must be **`prod`**.
3. You must have a **live swap stream** connected — otherwise: *"swap streaming is offline. Connect your swap stream to resume quoting."*

**Field validation:**

- `maker_id` non-empty.
- `maker_address` non-empty and a valid base58 Solana address.
- `lot_size_base` exactly equals `10^(base_decimals - quote_decimals)`.
- `quote_expiry_time` ≥ the minimum (default 10 seconds).
- At least one bid or ask level, and every level has `price > 0` and `volume > 0`.
- **Inventory check:** the server fetches your on-chain associated token accounts for both tokens. If an ATA is missing, the quote is rejected. Levels are then dropped **above** the first size tier that exceeds your balance (that first over-balance level is kept); if every level is dropped, the quote is rejected.
- `sequence_number` strictly greater than your last accepted value.

The server keeps only the **top 5 levels per side** and replaces your previous orderbook for that pair on each accepted quote (quotes are full snapshots, not deltas).

## Error handling

- **Quote errors** arrive as `UPDATE_TYPE_REJECTED` with a `status_message`. Common causes: swap stream not connected, non-`prod` status, `lot_size_base` mismatch, expiry below minimum, zero price/volume, missing ATAs, out-of-order sequence.
- **Swap errors** arrive as `SwapUpdate` with `SWAP_MESSAGE_TYPE_ERROR` and a `status_message`. Causes include an unknown `swap_uuid`, a response after the deadline (*"Swap response too late"*), or a modified transaction message (*"Transaction message modified by market maker"* — which also forces your account `offline`).
- **Transport errors** (connection drops, gRPC status errors) surface as SDK errors on `send_*`/`receive_*`; use them to trigger [reconnection](./sdk-integration.md#reconnection).

## Operational notes

- **Repricing cadence:** there is no fixed response deadline for quoting; reprice on your own schedule. Set a sensible `quote_expiry_time` (≥ 10s) so stale prices drop out.
- **Reconnection backoff:** the SDK does not reconnect for you. Implement exponential backoff (e.g. 1s, 2s, 4s, 8s, capped at 60s) and re-sync your sequence number after reconnecting.
- **Reflection:** the service exposes gRPC reflection; the SDK's `reflection_cli` example can introspect the live schema and verify connectivity.

## Next steps

- **[SDK Integration](./sdk-integration.md)** — apply this contract with the SDKs.
- **[Last Look & Maker Safety](./last-look-and-safety.md)** — validate and co-sign fills.
- **[Testing](./testing.md)** — verify end to end.
