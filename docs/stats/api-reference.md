---
title: API Reference
sidebar_position: 6
---

# JupiterZ API Reference

## Transaction Endpoints

#### Get Transaction by ID
- **Endpoint:** `GET /api/transactions/:id`
- **Parameters:** `id` (required) - Transaction ID

#### Get Transaction Statistics  
- **Endpoint:** `GET /api/transactions/stats`

#### Get Transactions by Slot Range
- **Endpoint:** `GET /api/transactions/slot-range`
- **Parameters:** `start_slot`, `end_slot` (required)

#### Get Latest Transaction
- **Endpoint:** `GET /api/transactions/latest`

#### Get Transaction by Request ID
- **Endpoint:** `GET /api/transactions/by-request-id`
- **Parameters:** `request_id` (required)

## Statistics Endpoints

#### Get 7-Day Volume
- **Endpoint:** `GET /api/stats/7d/volume`

#### Get 7-Day Fees
- **Endpoint:** `GET /api/stats/7d/fees`

#### Get 7-Day Trade Count
- **Endpoint:** `GET /api/stats/7d/trade-count`

#### Get 7-Day Daily Statistics
- **Endpoint:** `GET /api/stats/7d/daily`

#### Get 7-Day Average Fee
- **Endpoint:** `GET /api/stats/7d/average-fee`

#### Get Comprehensive Statistics
- **Endpoint:** `GET /api/stats/7d/comprehensive`

## Token & Pair Analytics

#### Get Top Token Pairs
- **Endpoint:** `GET /api/stats/7d/top-pairs`
- **Parameters:** `limit` (optional, default: 10, max: 100)

#### Get Top Market Makers
- **Endpoint:** `GET /api/stats/7d/top-makers`
- **Parameters:** `limit` (optional, default: 10, max: 100)

#### Get Token Volume
- **Endpoint:** `GET /api/stats/7d/token-volume`
- **Parameters:** `token_id` (required) - Token mint address
