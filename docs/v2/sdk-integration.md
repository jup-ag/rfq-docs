# SDK Integration Guide

This guide covers integrating with RFQ v2 using the official Rust and Python SDKs. Both SDKs share the same shape, naming, and feature set so you can switch between them without re-learning the API.

For runnable examples, see the `examples/` directory in each SDK — they are self-contained and the most up-to-date reference.

## Rust SDK

### Installation

Clone the SDK and build:

```bash
git clone https://github.com/jup-ag/rfq-v2-sdk
cd rfq-v2-sdk/rust-sdk
cargo build --release
```

**Requirements**: Rust 1.70+ and the Tokio runtime.

### Key Concepts

**Quote Streaming**
- Connect to the RFQ server using your credentials
- Submit orderbooks with bid/ask price levels
- Receive acknowledgments (quote accepted, updated, or expired)
- Continuously update quotes based on market conditions

**Swap Execution**
- Receive swap notifications with unsigned transactions
- Validate swap details (price, volume, token addresses)
- Sign transactions if accepted (last look capability)
- Submit signed transactions back to the server
- Receive confirmation when published to Solana

### Running Examples

```bash
cargo run --example production_streaming
```

Other bundled examples: `reflection_cli`, `deploy_spl_token`.

The `production_streaming` example demonstrates:
- Establishing a gRPC connection with authentication
- Managing sequence numbers for quote synchronization
- Submitting multi-level orderbooks
- Handling swap requests with last look validation
- Error handling and reconnection logic

---

## Python SDK

### Installation

The Python protobuf stubs are not committed to the repo — they are generated locally from `protos/market_maker.proto` after cloning. Generate them once, then install.

```bash
git clone https://github.com/jup-ag/rfq-v2-sdk
cd rfq-v2-sdk/python-sdk
python -m venv ./venv && source venv/bin/activate
pip install grpcio-tools
python scripts/generate_protos.py
pip install .
```

Re-run `python scripts/generate_protos.py` whenever the `.proto` file changes.

**Requirements**: Python 3.8+. Dependencies installed by `pip install .`: `grpcio`, `grpcio-tools`, `grpcio-reflection`, `protobuf`, `solders`, `base58`.

### Key Concepts

**Quote Streaming**
- Use the async/await pattern for streaming quotes
- Maintain monotonic sequence numbers
- Define token pairs with proper decimals
- Submit price levels for both bid and ask sides
- Handle quote lifecycle (new, updated, expired)

**Swap Execution**
- Listen for swap notifications on a separate stream
- Decode base58 encoded transactions
- Implement custom validation logic
- Sign with a Solana keypair via `solders`
- Return signed transaction or reject swap

### Running Examples

```bash
python examples/production_streaming.py
```

Other bundled examples: `reflection_cli.py`, `deploy_spl_token.py`.

The `production_streaming` example demonstrates:
- Async client initialization
- Quote stream management
- Swap stream handling with last look
- Transaction signing with the `solders` library
- Proper error handling and logging

---

## Integration Workflow

### 1. Setup Environment

Configure required environment variables:

- `MM_MAKER_ID` — Your market maker identifier
- `MM_AUTH_TOKEN` — JWT authentication token
- `RFQ_ENDPOINT` — RFQ service endpoint
- `SOLANA_PRIVATE_KEY` — Base58 encoded private key

### 2. Initialize Client

Both SDKs provide a client that handles:

- gRPC connection management
- TLS encryption
- Authentication headers
- Stream lifecycle

### 3. Stream Quotes

- Get the last sequence number (for reconnection)
- Create token pair definitions
- Build price levels (volume and price)
- Send quotes periodically (before expiry)
- Listen for server updates

### 4. Handle Swaps

- Monitor the swap stream for notifications
- Decode the unsigned transaction
- Validate against your criteria
- Sign if acceptable
- Submit or reject
- Track confirmations

### 5. Error Recovery

- Reconnect with exponential backoff (1s, 2s, 4s, 8s, max 60s)
- Resynchronize sequence numbers after disconnect
- Resubmit active quotes
- Log for debugging

---

## Advanced Topics

### Multi-Token Pair Support

Stream quotes for multiple token pairs by submitting separate quote messages with different `token_pair` values. The server maintains orderbooks per pair.

### Dynamic Pricing

Update quotes based on:

- External price feeds (CEX prices, oracles)
- Inventory management (reduce size when inventory is low)
- Market volatility (widen spreads in volatile conditions)
- Volume-based spreads (better prices for larger trades)

### Performance Tips

- **Rust**: use `tokio::spawn` for parallel quote generation; batch updates where appropriate; pool connections for external data sources.
- **Python**: use `asyncio.gather()` for concurrent operations; cache token metadata; profile critical paths.

---

## SDK Reference

**Rust SDK**: generate API docs locally with `cargo doc --open`. Inline documentation lives in the source under `src/`.

**Python SDK**: docstrings and type hints live in the source under `src/rfq_sdk/`. Use IDE autocomplete to explore.

Both SDKs include comprehensive examples — see the `examples/` directories for production streaming, reflection tooling, and SPL token deployment.

---

## Next Steps

- **[gRPC API Reference](./grpc-api.md)**: Detailed protocol specification
- **[Integration Testing](./testing.md)**: Required tests to pass before going live
- **[Architecture](../v2.md)**: System design and data flow
- **[Getting Started](./getting-started.md)**: Initial setup and configuration
