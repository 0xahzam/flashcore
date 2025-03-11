import { Connection } from "@solana/web3.js";
import { event, Parser } from "../event";

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
  },
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
  },
);

async function main() {
  const connection = new Connection(
    process.env.RPC_URL || "https://api.mainnet-beta.solana.com",
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
