import { Connection } from "@solana/web3.js";
import { event, Parser } from "../event";

const driftSwapRecord = event(
  "SwapRecord",
  [162, 187, 123, 194, 138, 56, 250, 241],
  (r) => {
    return {
      ts: r.i64(),
      user: r.pubkey(),
      amountOut: r.u64(),
      amountIn: r.u64(),
      outMarketIndex: r.u16(),
      inMarketIndex: r.u16(),
      outOraclePrice: r.i64(),
      inOraclePrice: r.i64(),
      fee: r.u64(),
    };
  },
);

async function main() {
  const connection = new Connection(
    process.env.RPC_URL || "https://api.mainnet-beta.solana.com",
  );
  const parser = new Parser(connection).on(driftSwapRecord);
  const signature =
    "4wus8CkrJJchnUcwJMK3c3Wo3ZzGjRxgc5F7hNqPBx8sqNSFiEmbcFWqaRgVLNmvjZc4Q3MnQxN7yAHuXgk7FnxM";

  console.log(`Parsing Drift SwapRecord: ${signature}`);
  try {
    const events = await parser.parse(signature);
    console.log(events);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
