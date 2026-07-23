# Getting Started

This guide gets you from zero to a running market-maker connection: obtaining credentials, installing an SDK, and streaming your first quote.

## Prerequisites

**Credentials from Jupiter.** Onboarding is currently handled by the Jupiter team. You will receive:

- **API key** — authenticates your gRPC connection.
- **Maker id** — your provider identifier (the `provider` string on your account). It is also the identity your quotes are keyed under.
- **gRPC endpoint** — the ingestion service to connect to. The SDK examples default to the edge endpoint `https://rfq-mm-edge-grpc.raccoons.dev`.

**A Solana keypair.** A base58-encoded private key used to co-sign fills. Its public key is your **maker address**; it must hold associated token accounts (ATAs) with inventory for every token you quote, or the server will filter out (or reject) your levels.

**A toolchain:**

- **Rust SDK** — Rust 1.70+ with the Tokio runtime.
- **Python SDK** — Python 3.8+ with asyncio.

## Environment variables

The bundled examples read configuration from the environment. Set what you have:

| Variable | Used for | Notes |
|---|---|---|
| `MM_AUTH_TOKEN` | Your API key | Sent as gRPC metadata by the SDK. Not a JWT — see [Authentication](./grpc-api.md#authentication). |
| `MM_MAKER_ID` | Your maker id | Set on every quote and used for sequence tracking. |
| `SOLANA_PRIVATE_KEY` | Base58 private key for signing | If unset, `production_streaming` generates a throwaway keypair (signatures from it are worthless). |
| `DATAPI_URL` | Reference price feed | Optional; defaults to `https://datapi.jup.ag`. Used only by the example's pricing logic. |

```bash
export MM_AUTH_TOKEN="your-api-key"
export MM_MAKER_ID="your-maker-id"
export SOLANA_PRIVATE_KEY="your-base58-private-key"
```

:::note There is no `RFQ_ENDPOINT` variable
The gRPC endpoint is passed to the client in code (`ClientConfig`), not read from the environment. The `production_streaming` example uses a hardcoded edge endpoint; change it in code, or adapt the example to read your own variable. See [SDK Integration](./sdk-integration.md#connecting).
:::

## Choose your SDK

Jupiter ships official SDKs in **Rust** and **Python** from the same repository. They share the same shape, naming, and feature set, and both generate their message types from the shared [`protos/market_maker.proto`](https://github.com/jup-ag/rfq-v2-sdk/blob/main/protos/market_maker.proto). Pick the one that fits your stack.

### Rust SDK

Clone and build:

```bash
git clone https://github.com/jup-ag/rfq-v2-sdk
cd rfq-v2-sdk/rust-sdk
cargo build --release
```

The crate is named **`market-maker-client-sdk`** (library import path `market_maker_client_sdk`). The proto is compiled at build time using a vendored `protoc`, so you do **not** need a system protobuf install.

To depend on it from your own project, add a path or git dependency (the package name differs from the repo name):

```toml
# Cargo.toml
[dependencies]
market-maker-client-sdk = { git = "https://github.com/jup-ag/rfq-v2-sdk", package = "market-maker-client-sdk" }
# or, from a local clone:
# market-maker-client-sdk = { path = "../rfq-v2-sdk/rust-sdk" }
```

:::note Signing is your responsibility
The SDK moves opaque transaction strings — you implement the co-signing. In the **Rust** SDK, `solana-sdk` is only a dev-dependency (used by the examples), so add `solana-sdk` to your own project to sign. The **Python** SDK already ships `solders` and `base58` as runtime dependencies, so signing works out of the box.
:::

Verify the setup by running the streaming example:

```bash
cargo run --example production_streaming
```

Other bundled examples: `maker_safety`, `reflection_cli`, `deploy_spl_token` — see [SDK Integration](./sdk-integration.md) and [Last Look & Maker Safety](./last-look-and-safety.md).

### Python SDK

The protobuf stubs are **not committed** — you generate them locally from the shared proto after cloning, then install:

```bash
git clone https://github.com/jup-ag/rfq-v2-sdk
cd rfq-v2-sdk/python-sdk
python -m venv ./venv && source venv/bin/activate
pip install grpcio-tools
python scripts/generate_protos.py
pip install .
```

The distribution is **`jupiter-rfq-sdk`**; the import name is **`rfq_sdk`**. Re-run `python scripts/generate_protos.py` whenever the `.proto` file changes.

:::warning Regenerate stubs before importing
`import rfq_sdk` fails with a `ModuleNotFoundError` (and a message telling you to run the generator) if the stubs are missing. Always run `generate_protos.py` after cloning or updating the proto.
:::

Dependencies installed by `pip install .`: `grpcio`, `grpcio-tools`, `grpcio-reflection`, `protobuf`, `solders`, `base58`. (The bare `requirements.txt` omits `grpcio-reflection`, which the reflection tooling needs — prefer `pip install .`.)

Verify the setup:

```bash
python examples/production_streaming.py
```

Other bundled examples: `reflection_cli.py`, `deploy_spl_token.py`.

## What the example does

`production_streaming` is the reference integration. On startup it:

1. Loads (or generates) a signing keypair from `SOLANA_PRIVATE_KEY`.
2. Fetches reference prices for SOL and a demo SPL token from DatAPI.
3. Connects to the gRPC endpoint with your API key.
4. Opens the **swap stream** (background task) and the **quote stream** (synchronising the starting sequence number with the server).
5. Streams multi-level SOL/USDC and demo-token/USDC orderbooks, refreshing prices periodically.
6. On each `SWAP_AVAILABLE`, validates and co-signs the transaction, then submits it.

Read it top to bottom — it is the most up-to-date, runnable reference for the flows described in [SDK Integration](./sdk-integration.md).

## Next steps

- **[SDK Integration](./sdk-integration.md)** — the connection, quoting, and swap loops in detail.
- **[Last Look & Maker Safety](./last-look-and-safety.md)** — how to validate fills before signing.
- **[gRPC API Reference](./grpc-api.md)** — message schemas, encoding, and validation rules.
- **[Testing](./testing.md)** — verify your integration before going live.
