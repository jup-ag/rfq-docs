# SDK Integration Guide

This guide covers integrating with RFQ v2 using the official Rust and Python SDKs.

## Rust SDK

### Installation

Clone the SDK repository:

```bash
git clone https://github.com/jup-ag/rfq-v2-sdk
cd rfq-v2-sdk/rust-sdk
```

### Requirements

- Rust 1.70 or later
- Tokio runtime for async operations

### Key Concepts

**Quote Streaming**
- Connect to RFQ server using your credentials
- Submit orderbooks with bid/ask price levels
- Receive acknowledgments (quote accepted, updated, or expired)
- Continuously update quotes based on market conditions

**Swap Execution**
- Receive swap notifications with unsigned transactions
- Validate swap details (price, volume, token addresses)
- Sign transactions if accepted (last look capability)
- Submit signed transactions back to server
- Receive confirmation when published to Solana

### Running Examples

The SDK includes production-ready examples:

```bash
cd rust-sdk
cargo run --example production_streaming
```

This example demonstrates:
- Establishing gRPC connection with authentication
- Managing sequence numbers for quote synchronization
- Submitting multi-level orderbooks
- Handling swap requests with last look validation
- Error handling and reconnection logic

---

## Python SDK

### Installation

```bash
git clone https://github.com/jup-ag/rfq-v2-sdk
cd rfq-v2-sdk/python-sdk
pip install -e .
```

### Requirements

- Python 3.8+
- asyncio
- grpcio, protobuf, solders, base58

### Key Concepts

**Quote Streaming**
- Use async/await pattern for streaming quotes
- Maintain monotonic sequence numbers
- Define token pairs with proper decimals
- Submit price levels for both bid and ask sides
- Handle quote lifecycle (new, updated, expired)

**Swap Execution**
- Listen for swap notifications on separate stream
- Decode base58 encoded transactions
- Implement custom validation logic
- Sign with Solana keypair
- Return signed transaction or reject swap

### Running Examples

```bash
cd python-sdk
python examples/production_streaming.py
```

This example demonstrates:
- Async client initialization
- Quote stream management
- Swap stream handling with last look
- Transaction signing with solders library
- Proper error handling and logging

---

## Integration Workflow

### 1. Setup Environment

Configure required environment variables:
- `MM_MAKER_ID` - Your market maker identifier
- `MM_AUTH_TOKEN` - JWT authentication token
- `RFQ_ENDPOINT` - RFQ service endpoint
- `SOLANA_PRIVATE_KEY` - Base58 encoded private key

### 2. Initialize Client

Both SDKs provide client classes that handle:
- gRPC connection management
- TLS encryption
- Authentication headers
- Stream lifecycle

### 3. Stream Quotes

Key steps:
- Get last sequence number (for reconnection)
- Create token pair definitions
- Build price levels (volume and price)
- Send quotes periodically (before expiry)
- Listen for server updates

### 4. Handle Swaps

Key steps:
- Monitor swap stream for notifications
- Decode unsigned transaction
- Validate against your criteria
- Sign if acceptable
- Submit or reject
- Track confirmations

### 5. Error Recovery

Implement robust error handling:
- Reconnection with exponential backoff
- Sequence number resynchronization
- Quote resubmission after disconnect
- Logging for debugging

---

## Advanced Topics

### Multi-Token Pair Support

Stream quotes for multiple token pairs by creating separate quote messages with different `token_pair` values. The server maintains orderbooks per pair.

### Dynamic Pricing

Update quotes based on:
- External price feeds (CEX prices, oracles)
- Inventory management (reduce size when inventory is low)
- Market volatility (widen spreads in volatile conditions)
- Volume-based spreads (better prices for larger trades)

### Error Handling

Essential error handling patterns:
- Reconnection logic with exponential backoff (1s, 2s, 4s, 8s, max 60s)
- Sequence number synchronization after disconnect
- Transaction validation before signing (price, volume, tokens, fees)
- Comprehensive logging and monitoring

### Performance Optimization

**Rust:**
- Use `tokio::spawn` for parallel quote generation
- Batch quote updates when appropriate
- Implement efficient price calculations
- Use connection pooling for external data sources

**Python:**
- Use `asyncio.gather()` for concurrent operations
- Cache token metadata to avoid repeated lookups
- Profile critical paths with `cProfile`
- Consider using asyncio event loops efficiently

---

## SDK Reference

For complete API documentation:

**Rust SDK:**
- Generate docs locally: `cargo doc --open`
- See inline documentation in source code
- Review examples in `examples/` directory

**Python SDK:**
- Check docstrings and type hints in source
- Use IDE autocomplete for available methods
- Review examples in `examples/` directory

## Example Resources

Both SDKs include comprehensive examples on GitHub:

- **Production streaming**: Complete integration with price feeds
- **Basic streaming**: Minimal setup for getting started
- **Error handling**: Reconnection and recovery patterns
- **Multi-pair**: Handling multiple token pairs

Visit the [rfq-v2-sdk repository](https://github.com/jup-ag/rfq-v2-sdk) for the latest examples and updates.

---

## Next Steps

- **[gRPC API Reference](./grpc-api.md)**: Detailed protocol specification
- **[Architecture](../v2.md)**: System design and data flow
- **[Getting Started](./getting-started.md)**: Initial setup and configuration
