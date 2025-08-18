---
title: Troubleshooting
description: Solution to commonly known errors
sidebar_position: 2
---

# Troubleshooting

#### Requests do not reach the webhook during integration tests
The most likely cause is a request timeout. Check the timeout requirements [here](../integration/overview.md#response-time).  

#### The webhook provides a quote, but the RFQ returns a 404
The most probable cause is that the quote **fails simulation**. Every quote is simulated, and those that fail **are not propagated to the frontend**. The most common reasons for simulation failure are:  

1. The Maker does not have enough inventory for the swap.  
2. The Maker does not have enough SOL to cover network fees.  
3. The Maker does not have an **Associated Token Account (ATA)** for either the input or output mint.
4. The Taker does not have enough funds for the swap.  

Regarding point **#3**, the Maker is required to have the **ATA configured** for all tokens it advertises; SOL are automatically wrapped by the Order Engine program, the Maker must have the ATA for WSOL as well to proecess SOL swaps.  

#### The webhook returns the best quote, but it is not the one presented to the user
See the section ["The webhook provides a quote, but the RFQ returns a 404"](#the-webhook-provides-a-quote-but-the-rfq-returns-a-404).
