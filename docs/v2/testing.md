# Testing

The SDK ships a test suite you can run against your integration: **unit tests** that need no network, **end-to-end tests** that exercise the full RFQ v2 order-to-settlement flow against the preprod environment, and **maker-safety tests** that prove the anti-tamper guards work. This page also covers the checklist to clear before production onboarding.

:::warning End-to-end tests move real funds
The `test_execute_order` test signs and submits a **real swap** against preprod (`https://preprod.ultra-api.jup.ag`). Use a dedicated **taker** wallet funded with a small balance you are willing to spend. The read-only and offline tests do not move funds.
:::

## What the tests exercise

The end-to-end tests act as a **taker** against the preprod Ultra API over HTTP: they fetch an order, sign it, and (for the execute test) submit it — confirming that the RFQ v2 order-to-settlement path works. The gRPC streaming paths are covered by the **unit tests**, which run in-process against a mock server (no live gRPC endpoint is contacted).

To validate that **your own** quotes are live and fillable, point `INPUT_MINT`/`OUTPUT_MINT` at a pair you quote on preprod and run the execute test.

## Environment variables

| Variable | Used for | Default | Required |
|---|---|---|---|
| `SOLANA_PRIVATE_KEY` | Base58 taker keypair used to sign | none | **Yes** for the signing/execute tests |
| `TAKER` | Taker public key | derived from `SOLANA_PRIVATE_KEY` | No (but set one of `TAKER`/`SOLANA_PRIVATE_KEY`) |
| `ULTRA_API_BASE` | Preprod Ultra API base URL | `https://preprod.ultra-api.jup.ag` | No |
| `INPUT_MINT` | Input side mint | USDC (`EPjFWdd5…Dt1v`) | No |
| `OUTPUT_MINT` | Output side mint | a demo SPL token (`A3QAoKnf…ExkDp`) | No |
| `RUN_INTEGRATION_TESTS` | Enables the Python integration suite | unset | **Python only** |

## Rust

:::note Rust e2e tests are not `#[ignore]`d
Unlike many test suites, the Rust e2e tests are **not** gated behind `#[ignore]`. A plain `cargo test` will attempt to run them against preprod and fail if `SOLANA_PRIVATE_KEY` isn't set. Run the unit tests and the live tests separately, as below.
:::

**Unit tests (offline, no credentials):**

```bash
cd rfq-v2-sdk/rust-sdk
cargo test --lib
```

**End-to-end tests (live — hits preprod):**

```bash
SOLANA_PRIVATE_KEY=... cargo test --test ultra_api_e2e -- --nocapture
```

**A single e2e test:**

```bash
SOLANA_PRIVATE_KEY=... cargo test --test ultra_api_e2e test_execute_order -- --nocapture
```

## Python

The Python integration tests are gated by **both** the `integration` marker **and** the `RUN_INTEGRATION_TESTS` environment variable, so an accidental `pytest` never hits live services. Make sure the SDK is installed first (see [Getting Started](./getting-started.md#python-sdk)).

**Unit tests only (offline):**

```bash
cd rfq-v2-sdk/python-sdk
pytest -m "not integration"
```

**Integration suite (live — hits preprod):**

```bash
RUN_INTEGRATION_TESTS=1 \
SOLANA_PRIVATE_KEY=... \
pytest -m integration -s
```

**A single integration test:**

```bash
RUN_INTEGRATION_TESTS=1 \
SOLANA_PRIVATE_KEY=... \
pytest tests/test_ultra_api_e2e.py::test_execute_order -s
```

## The end-to-end tests

Both SDKs share the same three tests:

| Test | What it does | Moves funds? |
|---|---|---|
| `test_ultra_api_order` | Fetches an order from preprod; asserts a request id and unsigned transaction are returned. | No |
| `test_execute_order` | Fetches, signs as the taker, and submits (`/execute`); asserts `status == "Success"`. | **Yes** |
| `test_decode_spl_token_order` | Fetches an order and inspects the transaction. | No |

`test_decode_spl_token_order` differs by language: the **Rust** version decodes the transaction with `fill-decoder` and asserts an RFQ v2 `fill_exact_in` is present (directly or embedded in a route); the **Python** version only checks the transaction parses and has instructions/accounts (there is no Python fill decoder).

## Maker-safety tests

The Rust SDK includes tests that prove the [maker-safety guards](./last-look-and-safety.md) work. These have no counterpart in the Python SDK.

**Offline (no network or keys)** — proves a tampered fill still decodes but inflates the taker's output, which is exactly what the exclusivity/last-look checks are designed to catch:

```bash
cargo test --test malicious_order_e2e test_tamper_inflates_out_offline -- --nocapture
```

**Live** — fetches a real order, re-prices the embedded fill in the taker's favour, submits it, and asserts the system **rejects** it (your funds stay safe):

```bash
SOLANA_PRIVATE_KEY=... cargo test --test malicious_order_e2e test_malicious_order_rejected -- --nocapture
```

## Inspecting transactions manually

The `fill-decoder` crate ships a CLI, `decode-tx`, for decoding a transaction and running the exclusivity check by hand — useful when debugging a fill you received on your swap stream:

```bash
cd rfq-v2-sdk/fill-decoder
cargo build --release --features cli
./target/release/decode-tx --base64 "<transaction-base64>" --check "<your-fill-authority-pubkey>"
```

Pass `--tx <signature> --rpc-url <url>` to fetch and decode a landed transaction, or `--json` for machine-readable output. See [Last Look & Maker Safety](./last-look-and-safety.md#validating-the-fill-rust-fill-decoder).

## Unit test coverage

The unit tests run fully offline (against in-process mock/echo gRPC servers) and are the fastest way to validate SDK behaviour while you build:

- **Builders** — quote construction and validation (required fields, non-zero levels, helpers).
- **Streaming** — quote round-trip, the async update iterator, swap ping/pong, and `SWAP_SUBMIT` → `TRANSACTION_CONFIRMED`.
- **Client** — `GetQuotes` and connection/context-manager behaviour.
- **Reflection** — service/message introspection and formatting.

## Pre-production checklist

Before requesting production onboarding, confirm:

- [ ] Unit tests pass (`cargo test --lib` / `pytest -m "not integration"`).
- [ ] End-to-end tests pass against preprod for the pairs you intend to quote.
- [ ] Your quote stream is stable and refreshes quotes before they expire.
- [ ] Your swap stream stays connected (quotes are rejected without it) and answers pings.
- [ ] Your last-look logic validates fills — decode the transaction and check exclusivity before signing (Rust makers can use `fill-decoder`).
- [ ] You co-sign at signer index 1 and never modify the transaction message.
- [ ] You respond to `SWAP_AVAILABLE` within the deadline (~10s).
- [ ] You have reconnection with backoff and sequence-number resync.
- [ ] Your maker wallet holds inventory (ATAs) for every token you quote.

## Support

- **Rust:** re-run with `-- --nocapture`. **Python:** re-run with `-s`.
- Verify `SOLANA_PRIVATE_KEY` is correct and the taker wallet is funded.
- Open an issue on the [rfq-v2-sdk repository](https://github.com/jup-ag/rfq-v2-sdk).
