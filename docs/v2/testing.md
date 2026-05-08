# Integration Testing

Before going live, every market maker must pass the RFQ v2 integration test suite. These end-to-end tests run against the live v2 gRPC service and the preprod Ultra API, verifying that quote streaming and swap execution work correctly.

The same test suite is available in both SDKs and exercises the same flows.

:::warning
Running the integration tests will perform real swaps on Solana mainnet. Make sure your taker wallet has sufficient funds before running them.
:::

## Prerequisites

Clone the SDK locally:

```bash
git clone https://github.com/jup-ag/rfq-v2-sdk
```

### Environment Variables

| Variable | Description | Required |
|---|---|---|
| `SOLANA_PRIVATE_KEY` | Base58-encoded private key of the **taker** wallet | **Yes** |
| `RUN_INTEGRATION_TESTS` | Must be `1` to enable the Python integration suite | **Yes (Python only)** |
| `INPUT_MINT` | SPL token mint for the input side (default: USDC) | No |
| `OUTPUT_MINT` | SPL token mint for the output side (default: SOL) | No |
| `TAKER` | Taker public key — derived from `SOLANA_PRIVATE_KEY` when omitted | No |
| `ULTRA_API_BASE` | Ultra API base URL (default: `https://preprod.ultra-api.jup.ag`) | No |

## Rust SDK

Integration tests are marked `#[ignore]` so they are skipped by default. Pass `--ignored` to run them.

### Run the full suite

```bash
cd rfq-v2-sdk/rust-sdk
cargo test --test ultra_api_e2e -- --ignored --nocapture
```

### Run a single test

```bash
cargo test --test ultra_api_e2e test_execute_order -- --ignored --nocapture
```

Available tests: `test_ultra_api_order`, `test_execute_order`, `test_decode_spl_token_order`.

## Python SDK

Integration tests are gated by both the `integration` pytest marker and the `RUN_INTEGRATION_TESTS=1` environment variable so an accidental `pytest -m integration` cannot hit live services.

Make sure the Python SDK is installed first — see [Getting Started](./getting-started.md#python-sdk).

### Run unit tests only

```bash
cd rfq-v2-sdk/python-sdk
pytest -m "not integration"
```

### Run the integration suite

```bash
RUN_INTEGRATION_TESTS=1 \
SOLANA_PRIVATE_KEY=... \
pytest -m integration -s
```

### Run a single test

```bash
RUN_INTEGRATION_TESTS=1 \
SOLANA_PRIVATE_KEY=... \
pytest tests/test_ultra_api_e2e.py::test_execute_order -s
```

Available tests: `test_ultra_api_order`, `test_execute_order`, `test_decode_spl_token_order`.

## What the Tests Verify

The integration tests validate the complete order flow from quote to settlement:

1. **Quote availability** — Your quotes are visible through the Ultra API for the configured token pair.
2. **Order execution** — A swap can be initiated, signed by the taker, and submitted successfully.
3. **Transaction confirmation** — The transaction lands on-chain and is confirmed.

## Checklist Before Requesting Review

Before reaching out to the Jupiter team for production onboarding, ensure:

- [ ] All integration tests pass against the preprod environment
- [ ] Your quote stream is stable and quotes refresh before expiry
- [ ] Swap stream handles `SWAP_AVAILABLE` → `SWAP_SUBMIT` → `TRANSACTION_CONFIRMED` flow correctly
- [ ] Error handling and reconnection logic are in place

## Support

- **Test failures**: Re-run with `--nocapture` (Rust) or `-s` (Python) for full output
- **Environment issues**: Verify your `SOLANA_PRIVATE_KEY` is correct and the wallet is funded
- **General help**: Open an issue on the [rfq-v2-sdk repository](https://github.com/jup-ag/rfq-v2-sdk)
