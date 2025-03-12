import { PublicKey } from "@solana/web3.js";

export class BufferReader {
  private data: Buffer;
  private offset: number;

  constructor(data: Buffer, offset = 0) {
    this.data = data;
    this.offset = offset;
  }

  u8(): number {
    const value = this.data.readUInt8(this.offset);
    this.offset += 1;
    return value;
  }

  u16(): number {
    const value = this.data.readUInt16LE(this.offset);
    this.offset += 2;
    return value;
  }

  u32(): number {
    const value = this.data.readUInt32LE(this.offset);
    this.offset += 4;
    return value;
  }

  u64(): bigint {
    const value = this.data.readBigUInt64LE(this.offset);
    this.offset += 8;
    return value;
  }

  u128(): bigint {
    const low = this.u64();
    const high = this.u64();
    return (high << BigInt(64)) | low;
  }

  // Signed integer reads
  i8(): number {
    const value = this.data.readInt8(this.offset);
    this.offset += 1;
    return value;
  }

  i16(): number {
    const value = this.data.readInt16LE(this.offset);
    this.offset += 2;
    return value;
  }

  i32(): number {
    const value = this.data.readInt32LE(this.offset);
    this.offset += 4;
    return value;
  }

  i64(): bigint {
    const value = this.data.readBigInt64LE(this.offset);
    this.offset += 8;
    return value;
  }
  i128(): bigint {
    const low = this.i64();
    const high = this.i64();

    // If high part is negative, we need to handle two's complement for 128-bit
    if (high < 0n) {
      return (high << BigInt(64)) | (low & BigInt("0xFFFFFFFFFFFFFFFF"));
    } else {
      return (high << BigInt(64)) | low;
    }
  }

  // Floating-point reads
  f32(): number {
    const value = this.data.readFloatLE(this.offset);
    this.offset += 4;
    return value;
  }

  f64(): number {
    const value = this.data.readDoubleLE(this.offset);
    this.offset += 8;
    return value;
  }

  // Boolean read (1 byte, 1 = true, 0 = false)
  bool(): boolean {
    return this.u8() === 1;
  }

  // Solana-specific public key (32 bytes)
  pubkey(): PublicKey {
    const key = new PublicKey(
      this.data.subarray(this.offset, this.offset + 32),
    );
    this.offset += 32;
    return key;
  }

  // Optional values (prefixed with a bool)
  optionU8(): number | null {
    return this.u8() === 1 ? this.u8() : null;
  }

  optionU16(): number | null {
    return this.u8() === 1 ? this.u16() : null;
  }

  optionU32(): number | null {
    return this.u8() === 1 ? this.u32() : null;
  }

  optionU64(): bigint | null {
    return this.u8() === 1 ? this.u64() : null;
  }

  optionI8(): number | null {
    return this.u8() === 1 ? this.i8() : null;
  }

  optionI16(): number | null {
    return this.u8() === 1 ? this.i16() : null;
  }

  optionI32(): number | null {
    return this.u8() === 1 ? this.i32() : null;
  }

  optionI64(): bigint | null {
    return this.u8() === 1 ? this.i64() : null;
  }

  optionF32(): number | null {
    return this.u8() === 1 ? this.f32() : null;
  }

  optionF64(): number | null {
    return this.u8() === 1 ? this.f64() : null;
  }

  optionPubkey(): PublicKey | null {
    return this.u8() === 1 ? this.pubkey() : null;
  }

  // Read raw bytes (zero-copy view)
  bytes(length: number): Buffer {
    const view = this.data.subarray(this.offset, this.offset + length);
    this.offset += length;
    return view;
  }

  // Skip bytes
  skip(n: number): this {
    this.offset += n;
    return this;
  }

  // Get current offset
  getOffset(): number {
    return this.offset;
  }

  // Set offset (for seeking)
  setOffset(offset: number): this {
    this.offset = offset;
    return this;
  }

  // Check remaining bytes
  remaining(): number {
    return this.data.length - this.offset;
  }

  // Check if at end
  isEnd(): boolean {
    return this.offset >= this.data.length;
  }
}
