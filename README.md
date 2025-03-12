# Flashcore

Solana event parser. Pulls data from logs.

## What

- Reads Solana transactions.
- Cracks events with discriminators.
- Spits out clean structs.

## Install

```
bun install flashcore
```

## Use

```
import { Parser, event } from "flashcore";
import { Connection } from "@solana/web3.js";

const conn = new Connection("https://api.mainnet-beta.solana.com");
const parser = new Parser(conn);

const swapEvent = event("SwapRecord", [162, 187, 123, 194, 138, 56, 250, 241], r => ({
ts: r.i64(),
user: r.pubkey(),
amountOut: r.u64(),
amountIn: r.u64()
}));

parser.on(swapEvent);
const tx = "4wus8CkrJJchnUcwJMK3c3Wo3ZzGjRxgc5F7hNqPBx8sqNSFiEmbcFWqaRgVLNmvjZc4Q3MnQxN7yAHuXgk7FnxM";
const data = await parser.parse(tx);
console.log(data);
```

## More

Check `examples/` in [github.com/0xahzam/rift](https://github.com/yourusername/rift/tree/main/examples). Tweak as you need.

## Status

Personal project. Early days. Works, but raw.
