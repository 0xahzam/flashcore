import { Connection } from "@solana/web3.js";
import { event, Parser } from "flashcore";

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
  }
);

async function main() {
  const connection = new Connection(
    process.env.RPC_URL || "https://api.mainnet-beta.solana.com"
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

/*
Output:
Parsing Marginfi Liquidation: 2kB8AN6imnButiLUhMUHtqqELUZhYfdo6AAYsgPvhUZFBY8WJuF9hEmPgaAVkT5t9NuETFCByoVDXagEZLfgBcRt
{
  LendingAccountLiquidateEvent: [
    {
      header: {
        signer: PublicKey(evoxxcAvFrt8Xg6cXKV2Q5SPpnxqEv14VdmAnHmQS13) {
          _bn: <BN: 9b755326a7cd5717ab1803b072d1c79d7b992c581c9eebfa5d9c14b64a22e9e>,
          equals: [Function: equals],
          toBase58: [Function: toBase58],
          toJSON: [Function: toJSON],
          toBytes: [Function: toBytes],
          toBuffer: [Function: toBuffer],
          toString: [Function: toString],
          encode: [Function: encode]
        },
        marginfiAccount: PublicKey(2zLGYr7tLavZHhwsN2kgAGLr7Romx7EafvJiTBZQK2Z7) {
          _bn: <BN: 1d8b945cb8620780a10739fa0e250ea552a60b29da900f83a37b1ebce294b22a>,
          equals: [Function: equals],
          toBase58: [Function: toBase58],
          toJSON: [Function: toJSON],
          toBytes: [Function: toBytes],
          toBuffer: [Function: toBuffer],
          toString: [Function: toString],
          encode: [Function: encode]
        },
        marginfiAccountAuthority: PublicKey(evoxxcAvFrt8Xg6cXKV2Q5SPpnxqEv14VdmAnHmQS13) {
          _bn: <BN: 9b755326a7cd5717ab1803b072d1c79d7b992c581c9eebfa5d9c14b64a22e9e>,
          equals: [Function: equals],
          toBase58: [Function: toBase58],
          toJSON: [Function: toJSON],
          toBytes: [Function: toBytes],
          toBuffer: [Function: toBuffer],
          toString: [Function: toString],
          encode: [Function: encode]
        },
        marginfiGroup: PublicKey(4qp6Fx6tnZkY5Wropq9wUYgtFxXKwE6viZxFHg3rdAG8) {
          _bn: <BN: 39142f682fd8388496ecbd5106f15c794c2477433828fa6642dbebf720034a61>,
          equals: [Function: equals],
          toBase58: [Function: toBase58],
          toJSON: [Function: toJSON],
          toBytes: [Function: toBytes],
          toBuffer: [Function: toBuffer],
          toString: [Function: toString],
          encode: [Function: encode]
        }
      },
      liquidateeMarginfiAccount: PublicKey(5P5upwkhdHsgeuhfxAaNLsKA3NdkkJZHGGM81GmF8Yng) {
        _bn: <BN: 41171402dc0bb9dc1ed73487281f96c424dfcbad7958aa9a42a45a57273507ed>,
        equals: [Function: equals],
        toBase58: [Function: toBase58],
        toJSON: [Function: toJSON],
        toBytes: [Function: toBytes],
        toBuffer: [Function: toBuffer],
        toString: [Function: toString],
        encode: [Function: encode]
      },
      liquidateeMarginfiAccountAuthority: PublicKey(3LkCqXSBzgkzHP4kwzXhS4nnpLAYXoGP83qP87w7Gn9t) {
        _bn: <BN: 22c6429eb1f0f23b33b721b8b7af07eec6aa9a5d052f97830e33519d5eef3ccf>,
        equals: [Function: equals],
        toBase58: [Function: toBase58],
        toJSON: [Function: toJSON],
        toBytes: [Function: toBytes],
        toBuffer: [Function: toBuffer],
        toString: [Function: toString],
        encode: [Function: encode]
      },
      assetBank: PublicKey(E4td8i8PT2BZkMygzW4MGHCv2KPPs57dvz5W2ZXf9Twu) {
        _bn: <BN: c2270af26000e321a738306c40886519d54523162cfdf9c38e8ddc4699bd8ff8>,
        equals: [Function: equals],
        toBase58: [Function: toBase58],
        toJSON: [Function: toJSON],
        toBytes: [Function: toBytes],
        toBuffer: [Function: toBuffer],
        toString: [Function: toString],
        encode: [Function: encode]
      },
      assetMint: PublicKey(HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3) {
        _bn: <BN: f5edec8471c75624ebc4079a634326d96a689e6157d79abe8f5a6f94472853bc>,
        equals: [Function: equals],
        toBase58: [Function: toBase58],
        toJSON: [Function: toJSON],
        toBytes: [Function: toBytes],
        toBuffer: [Function: toBuffer],
        toString: [Function: toString],
        encode: [Function: encode]
      },
      liabilityBank: PublicKey(2s37akK2eyBbp8DZgCm7RtsaEz8eJP3Nxd4urLHQv7yB) {
        _bn: <BN: 1bad1dfa3cb2f85dd7f6a667a9484e6816c7c777e9349d533c7349dcdf6fdf8a>,
        equals: [Function: equals],
        toBase58: [Function: toBase58],
        toJSON: [Function: toJSON],
        toBytes: [Function: toBytes],
        toBuffer: [Function: toBuffer],
        toString: [Function: toString],
        encode: [Function: encode]
      },
      liabilityMint: PublicKey(EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v) {
        _bn: <BN: c6fa7af3bedbad3a3d65f36aabc97431b1bbe4c2d2f6e0e47ca60203452f5d61>,
        equals: [Function: equals],
        toBase58: [Function: toBase58],
        toJSON: [Function: toJSON],
        toBytes: [Function: toBytes],
        toBuffer: [Function: toBuffer],
        toString: [Function: toString],
        encode: [Function: encode]
      },
      liquidateePreHealth: -0.5191353575839983,
      liquidateePostHealth: -0.0025932640542656316,
      preBalances: {
        liquidateeAssetBalance: 125441283.99984774,
        liquidateeLiabilityBalance: 10891123.711091014,
        liquidatorAssetBalance: 0,
        liquidatorLiabilityBalance: 0
      },
      postBalances: {
        liquidateeAssetBalance: 116151687.99984774,
        liquidateeLiabilityBalance: 9650504.034807522,
        liquidatorAssetBalance: 9289596,
        liquidatorLiabilityBalance: 1273267.5625014768
      }
    }
  ]
}
*/
