import { Connection } from "@solana/web3.js";
import { event, Parser } from "../src/event";

const marginfiLiquidationEvent = event(
  "LendingAccountLiquidateEvent",
  [166, 160, 249, 154, 183, 39, 23, 242],
  (r) => {
    const readBalances = () => ({
      liquidateeAssetBalance: r.f64(),
      liquidateeLiabilityBalance: r.f64(),
      liquidatorAssetBalance: r.f64(),
      liquidatorLiabilityBalance: r.f64(),
    });
    return {
      header: {
        signer: r.optionPubkey(),
        marginfiAccount: r.pubkey(),
        marginfiAccountAuthority: r.pubkey(),
        marginfiGroup: r.pubkey(),
      },
      liquidateeMarginfiAccount: r.pubkey(),
      liquidateeMarginfiAccountAuthority: r.pubkey(),
      assetBank: r.pubkey(),
      assetMint: r.pubkey(),
      liabilityBank: r.pubkey(),
      liabilityMint: r.pubkey(),
      liquidateePreHealth: r.f64(),
      liquidateePostHealth: r.f64(),
      preBalances: readBalances(),
      postBalances: readBalances(),
    };
  },
);

async function main() {
  const connection = new Connection(
    process.env.RPC_URL || "https://api.mainnet-beta.solana.com",
  );
  const parser = new Parser(connection).on(marginfiLiquidationEvent);
  const signature =
    "2kB8AN6imnButiLUhMUHtqqELUZhYfdo6AAYsgPvhUZFBY8WJuF9hEmPgaAVkT5t9NuETFCByoVDXagEZLfgBcRt";

  console.log(`Parsing Marginfi Liquidation: ${signature}`);
  try {
    const events = await parser.parse(signature);
    console.log(events);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
