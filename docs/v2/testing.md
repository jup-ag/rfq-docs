# Integration Testing

Before going live, every market maker must pass the RFQ v2 integration test suite. These are end-to-end tests that run against the live v2 gRPC service and the preprod Ultra API, verifying that your quote streaming and swap execution work correctly.

:::warning
Running the integration tests will perform real swaps on Solana mainnet. Make sure your taker wallet has sufficient funds before running the tests.
:::

## Prerequisites

You need the [Rust SDK](https://github.com/jup-ag/rfq-v2-sdk) cloned locally:

```bash
git clone https://github.com/jup-ag/rfq-v2-sdk
cd rfq-v2-sdk/rust-sdk
```

### Environment Variables

| Variable | Description | Required |
|---|---|---|
| `SOLANA_PRIVATE_KEY` | Base58-encoded private key of the **taker** wallet | **Yes** |
| `INPUT_MINT` | SPL token mint for the input side (default: USDC) | No |
| `OUTPUT_MINT` | SPL token mint for the output side (default: SOL) | No |
| `TAKER` | Taker public key — derived from `SOLANA_PRIVATE_KEY` when omitted | No |
| `ULTRA_API_BASE` | Ultra API base URL (default: `https://preprod.ultra-api.jup.ag`) | No |

## Running the Tests

### Run the full test suite

```bash
cargo test --test ultra_api_e2e
```

### Run a single test

```bash
cargo test --test ultra_api_e2e test_full_order_flow
```

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

- **Test failures**: Check logs with `--nocapture` for detailed output
- **Environment issues**: Verify your `SOLANA_PRIVATE_KEY` is correct and the wallet is funded
- **General help**: Open an issue on the [rfq-v2-sdk repository](https://github.com/jup-ag/rfq-v2-sdk)
