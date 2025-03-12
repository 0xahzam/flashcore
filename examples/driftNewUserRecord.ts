import { Connection } from "@solana/web3.js";
import { event, Parser } from "flashcore";

const driftNewUserRecord = event(
  "NewUserRecord",
  [236, 186, 113, 219, 42, 51, 149, 249],
  (r) => {
    return {
      ts: r.i64(),
      userAuthority: r.pubkey(),
      user: r.pubkey(),
      subAccountId: r.u16(),
      name: r.bytes(32),
      referrer: r.pubkey(),
    };
  }
);

const driftDepositRecord = event(
  "DepositRecord",
  [180, 241, 218, 207, 102, 135, 44, 134],
  (r) => {
    return {
      ts: r.i64(),
      userAuthority: r.pubkey(),
      user: r.pubkey(),
      direction: r.u8(),
      depositRecordId: r.u64(),
      amount: r.u64(),
      marketIndex: r.u16(),
      oraclePrice: r.i64(),
      marketDepositBalance: r.u128(),
      marketWithdrawBalance: r.u128(),
      marketCumulativeDepositInterest: r.u128(),
      marketCumulativeBorrowInterest: r.u128(),
      totalDepositsAfter: r.u64(),
      totalWithdrawsAfter: r.u64(),
      explanation: r.u8(),
      transferUser: r.optionPubkey(),
    };
  }
);

async function main() {
  const connection = new Connection(
    process.env.RPC_URL || "https://api.mainnet-beta.solana.com"
  );
  const parser = new Parser(connection)
    .on(driftNewUserRecord)
    .on(driftDepositRecord);

  const signature =
    "4JUYkpqnH4GpuqwLGiHN6NhCu97MavpLSGY2sYTjap5zUxJAvt867pVHNJ5uiqstR7nuhGgKe6Cr73cguBRc2Wqy";

  console.log(`Parsing Drift NewUserRecord: ${signature}`);
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
Parsing Drift NewUserRecord: 4JUYkpqnH4GpuqwLGiHN6NhCu97MavpLSGY2sYTjap5zUxJAvt867pVHNJ5uiqstR7nuhGgKe6Cr73cguBRc2Wqy
{
  NewUserRecord: [
    {
      ts: 1741719599n,
      userAuthority: PublicKey(9kSf2BB2dESLF1J3WXmpj8KiVL7ncabhvC1nYw2nd8UF) {
        _bn: <BN: 81fe7a9f39072752903fd407e8286770d85df29e85d014d7c0ee7d6b3b680938>,
        equals: [Function: equals],
        toBase58: [Function: toBase58],
        toJSON: [Function: toJSON],
        toBytes: [Function: toBytes],
        toBuffer: [Function: toBuffer],
        toString: [Function: toString],
        encode: [Function: encode]
      },
      user: PublicKey(3EmcS9WueGbiQZ6D8ofM2bJa6skTTq3QnD2VrDTJvJHJ) {
        _bn: <BN: 213e5db8e8e594476a4124f2e03617ff2dad1454f3f0d806dcf5fd550ad6892d>,
        equals: [Function: equals],
        toBase58: [Function: toBase58],
        toJSON: [Function: toJSON],
        toBytes: [Function: toBytes],
        toBuffer: [Function: toBuffer],
        toString: [Function: toString],
        encode: [Function: encode]
      },
      subAccountId: 0,
      name: Buffer(32) [ 77, 97, 105, 110, 32, 65, 99, 99, 111, 117, 110, 116, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32 ],
      referrer: PublicKey(11111111111111111111111111111111) {
        _bn: <BN: 0>,
        equals: [Function: equals],
        toBase58: [Function: toBase58],
        toJSON: [Function: toJSON],
        toBytes: [Function: toBytes],
        toBuffer: [Function: toBuffer],
        toString: [Function: toString],
        encode: [Function: encode]
      }
    }
  ],
  DepositRecord: [
    {
      ts: 1741719599n,
      userAuthority: PublicKey(9kSf2BB2dESLF1J3WXmpj8KiVL7ncabhvC1nYw2nd8UF) {
        _bn: <BN: 81fe7a9f39072752903fd407e8286770d85df29e85d014d7c0ee7d6b3b680938>,
        equals: [Function: equals],
        toBase58: [Function: toBase58],
        toJSON: [Function: toJSON],
        toBytes: [Function: toBytes],
        toBuffer: [Function: toBuffer],
        toString: [Function: toString],
        encode: [Function: encode]
      },
      user: PublicKey(3EmcS9WueGbiQZ6D8ofM2bJa6skTTq3QnD2VrDTJvJHJ) {
        _bn: <BN: 213e5db8e8e594476a4124f2e03617ff2dad1454f3f0d806dcf5fd550ad6892d>,
        equals: [Function: equals],
        toBase58: [Function: toBase58],
        toJSON: [Function: toJSON],
        toBytes: [Function: toBytes],
        toBuffer: [Function: toBuffer],
        toString: [Function: toString],
        encode: [Function: encode]
      },
      direction: 0,
      depositRecordId: 11531175n,
      amount: 138752387n,
      marketIndex: 0,
      oraclePrice: 1000000n,
      marketDepositBalance: 210946777092131493n,
      marketWithdrawBalance: 87360813184226559n,
      marketCumulativeDepositInterest: 11423744991n,
      marketCumulativeBorrowInterest: 12904864130n,
      totalDepositsAfter: 138752387n,
      totalWithdrawsAfter: 0n,
      explanation: 0,
      transferUser: null
    }
  ]
}
*/
