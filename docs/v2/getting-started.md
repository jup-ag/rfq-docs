# Getting Started with RFQ v2

This guide will help you set up your market maker integration with JupiterZ v2.

## Prerequisites

Before you begin, ensure you have:

- **Market Maker Credentials**: Contact Jupiter to obtain:
  - `MM_MAKER_ID`: Your unique market maker identifier
  - `MM_AUTH_TOKEN`: JWT authentication token
  - `RFQ_ENDPOINT`: RFQ service endpoint URL

- **Solana Wallet**: A Solana private key (base58 encoded) for signing transactions

- **Development Environment**:
  - For Rust: Rust 1.70+ with Tokio runtime
  - For Python: Python 3.8+ with asyncio support

## Environment Setup

### 1. Set Environment Variables

Create a `.env` file or export these variables:

```bash
export MM_MAKER_ID="your-maker-id"
export MM_AUTH_TOKEN="your-jwt-token"
export RFQ_ENDPOINT="rfq-endpoint-url"
export SOLANA_PRIVATE_KEY="your-base58-private-key"
```

### 2. Choose Your SDK

Jupiter provides official SDKs in Rust and Python. Both share the same shape, naming, and feature set — pick the one that fits your stack.

#### Rust SDK

Clone and build:

```bash
git clone https://github.com/jup-ag/rfq-v2-sdk
cd rfq-v2-sdk/rust-sdk
cargo build --release
```

**Requirements**: Rust 1.70+ and the Tokio runtime.

Run an example to verify the setup:

```bash
cargo run --example production_streaming
```

Other bundled examples: `reflection_cli`, `deploy_spl_token`.

#### Python SDK

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

Run an example to verify the setup:

```bash
python examples/production_streaming.py
```

Other bundled examples: `reflection_cli.py`, `deploy_spl_token.py`.

## Understanding the Flow

### Quote Streaming

Your market maker will:

1. **Connect** to the RFQ server via gRPC
2. **Submit** orderbooks with bid/ask levels for token pairs
3. **Receive** acknowledgments (quote accepted, updated, or expired)
4. **Update** quotes in real-time based on market conditions

### Swap Execution

When a user requests a swap:

1. **Receive** swap notification with unsigned transaction
2. **Validate** the swap details (price, volume, etc.)
3. **Sign** the transaction if you accept (last look)
4. **Submit** signed transaction back to RFQ server
5. **Confirm** transaction execution on Solana

## Price and Volume Encoding

- **Volume**: Expressed in base token's smallest unit (e.g., lamports for SOL, micro-units for USDC)
- **Price**: Quote token per unit of base token, scaled by quote-token decimals

**Example**: For SOL/USDC pair:
- SOL has 9 decimals, USDC has 6 decimals
- Price of 100.5 USDC per SOL = `100500000` (100.5 × 10^6)
- Volume of 10 SOL = `10000000000` (10 × 10^9)

See [gRPC API Reference](./grpc-api.md) for full message schemas.

## Sequence Numbers

Each market maker maintains a monotonic sequence number:

- Start from 1 for your first quote
- Increment by 1 for each new quote
- Use `GetLastSequenceNumber()` RPC to sync after reconnection

This ensures quote ordering and helps the server detect gaps.

## Connection Management

### Health Checks

Both quote and swap streams support ping/pong. The server periodically sends `PING` and the SDK automatically responds with `PONG`.

### Reconnection Logic

If the connection drops:

1. Get the last sequence number from the server
2. Resume from `last_sequence_number + 1`
3. Resubmit active quotes

### TLS / Authentication

All connections use:
- TLS encryption (production endpoints)
- JWT token authentication (in `auth_token` field or gRPC metadata)

## Next Steps

- **[SDK Integration Guide](./sdk-integration.md)**: SDK usage and integration workflow
- **[gRPC API Reference](./grpc-api.md)**: Complete protocol specification
- **[Integration Testing](./testing.md)**: Required tests to pass before going live
- **[Architecture](../v2.md)**: Understand the complete system flow

## Support

For integration support:
- Technical issues: Create an issue on [GitHub](https://github.com/jup-ag/rfq-v2-sdk)
- Credentials and onboarding: Contact the Jupiter team
- General questions: Join the Jupiter Discord
