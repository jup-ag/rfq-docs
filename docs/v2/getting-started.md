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

Jupiter provides official SDKs in Rust and Python. Choose based on your technology stack and performance requirements.

#### Rust SDK

**Installation:**

```bash
git clone https://github.com/jup-ag/rfq-v2-sdk
cd rfq-v2-sdk/rust-sdk
cargo build --release
```

**Requirements:**
- Rust 1.70 or later
- Tokio runtime for async operations

**Quick Test:**

```bash
cargo run --example production_streaming
```

#### Python SDK

**Installation:**

```bash
git clone https://github.com/jup-ag/rfq-v2-sdk
cd rfq-v2-sdk/python-sdk
python -m venv ./venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -e .
```

**Requirements:**
- Python 3.8+
- asyncio
- grpcio, protobuf, solders, base58

**Quick Test:**

```bash
python examples/production_streaming.py
```

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

## Basic Quote Structure

A market maker quote contains:

```typescript
{
  timestamp: 1234567890,           // Unix timestamp (microseconds)
  sequence_number: 1,              // Monotonic counter
  quote_expiry_time: 5000000,      // Quote validity (microseconds)
  maker_id: "your-maker-id",
  maker_address: "solana-address",
  lot_size_base: 1000000,          // Minimum trade size
  cluster: MAINNET,                // or DEVNET
  token_pair: {
    base_token: { address: "...", decimals: 6, symbol: "USDC" },
    quote_token: { address: "...", decimals: 9, symbol: "SOL" }
  },
  bid_levels: [
    { volume: 10000000000, price: 100500000 },
    { volume: 20000000000, price: 100400000 }
  ],
  ask_levels: [
    { volume: 10000000000, price: 100600000 },
    { volume: 20000000000, price: 100700000 }
  ]
}
```

## Price and Volume Encoding

- **Volume**: Expressed in base token's smallest unit (e.g., lamports for SOL, micro-units for USDC)
- **Price**: Quote token per unit of base token, scaled by decimals
  
**Example**: For SOL/USDC pair:
- SOL has 9 decimals, USDC has 6 decimals
- Price of 100.5 USDC per SOL = `100500000` (100.5 × 10^6)
- Volume of 10 SOL = `10000000000` (10 × 10^9)

## Sequence Numbers

Each market maker maintains a monotonic sequence number:

- Start from 1 for your first quote
- Increment by 1 for each new quote
- Use `GetLastSequenceNumber()` RPC to sync after reconnection

This ensures quote ordering and helps the server detect gaps.

## Connection Management

### Health Checks

Both quote and swap streams support ping/pong:

```python
# Server will periodically send PING
# SDK automatically responds with PONG
```

### Reconnection Logic

If connection drops:

1. Get last sequence number from server
2. Resume from `last_sequence_number + 1`
3. Resubmit active quotes

### TLS/Authentication

All connections use:
- TLS encryption (production endpoints)
- JWT token authentication (in `auth_token` field or metadata)

## Next Steps

- **[SDK Integration Guide](./sdk-integration.md)**: Detailed SDK usage with code examples
- **[gRPC API Reference](./grpc-api.md)**: Complete protocol specification
- **[Architecture](../v2.md)**: Understand the complete system flow

## Support

For integration support:
- Technical issues: Create an issue on GitHub
- Credentials and onboarding: Contact Jupiter team
- General questions: Join Jupiter Discord
