import { Connection } from "@solana/web3.js";
import { BufferReader } from "./buffer";

export interface Event<T> {
  name: string;
  discriminator: Uint8Array;
  decode: (reader: BufferReader) => T;
}

export function event<T>(
  name: string,
  bytes: number[],
  decode: (reader: BufferReader) => T,
): Event<T> {
  return {
    name,
    discriminator: new Uint8Array(bytes),
    decode,
  };
}

export class Parser {
  private events: Event<any>[];
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
    this.events = [];
  }

  on<T>(event: Event<T>): this {
    this.events.push(event);
    return this;
  }

  async getProgramData(signature: string): Promise<Buffer[]> {
    const tx = await this.connection.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });

    if (!tx?.meta?.logMessages) {
      throw new Error(`Transaction not found or has no logs: ${signature}`);
    }

    const logs = tx.meta.logMessages;
    const buffers: Buffer[] = [];
    const logPrefix = "Program data: ";

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      if (log.startsWith(logPrefix)) {
        const base64Data = log.slice(logPrefix.length).trim();
        if (base64Data) {
          buffers.push(Buffer.from(base64Data, "base64"));
        }
      }
    }

    return buffers;
  }

  async parse(signature: string): Promise<Record<string, any[]>> {
    const dataBuffers = await this.getProgramData(signature);
    const results: Record<string, any[]> = {};
    const eventCount = this.events.length;

    for (let i = 0; i < dataBuffers.length; i++) {
      const data = dataBuffers[i];
      for (let j = 0; j < eventCount; j++) {
        const eventDesc = this.events[j];
        if (this.matchesDiscriminatorFast(data, eventDesc.discriminator)) {
          if (!results[eventDesc.name]) {
            results[eventDesc.name] = [];
          }

          try {
            const reader = new BufferReader(
              data,
              eventDesc.discriminator.length,
            );
            const decodedEvent = eventDesc.decode(reader);
            results[eventDesc.name].push(decodedEvent);
          } catch (err) {
            console.warn(`Error decoding ${eventDesc.name}:`, err);
          }
        }
      }
    }

    return results;
  }

  parseEventFromBase64(
    base64ProgramData: string,
    Events?: Event<any>[],
  ): Record<string, any[]> {
    const data = Buffer.from(base64ProgramData.trim(), "base64");
    const results: Record<string, any[]> = {};
    const eventsToCheck = Events || this.events;
    const eventCount = eventsToCheck.length;

    if (eventCount === 1) {
      const eventDesc = eventsToCheck[0];
      if (this.matchesDiscriminatorFast(data, eventDesc.discriminator)) {
        try {
          const reader = new BufferReader(data, eventDesc.discriminator.length);
          if (!results[eventDesc.name]) results[eventDesc.name] = [];
          results[eventDesc.name].push(eventDesc.decode(reader));
        } catch (err) {
          console.warn(`Error decoding ${eventDesc.name}:`, err);
        }
      }
    } else {
      for (let i = 0; i < eventCount; i++) {
        const eventDesc = eventsToCheck[i];
        if (this.matchesDiscriminatorFast(data, eventDesc.discriminator)) {
          try {
            const reader = new BufferReader(
              data,
              eventDesc.discriminator.length,
            );
            if (!results[eventDesc.name]) results[eventDesc.name] = [];
            results[eventDesc.name].push(eventDesc.decode(reader));
          } catch (err) {
            console.warn(`Error decoding ${eventDesc.name}:`, err);
          }
        }
      }
    }

    return results;
  }

  private matchesDiscriminatorFast(
    data: Buffer,
    discriminator: Uint8Array,
  ): boolean {
    if (data.length < discriminator.length) return false;

    if (discriminator.length === 8) {
      return (
        data[0] === discriminator[0] &&
        data[1] === discriminator[1] &&
        data[2] === discriminator[2] &&
        data[3] === discriminator[3] &&
        data[4] === discriminator[4] &&
        data[5] === discriminator[5] &&
        data[6] === discriminator[6] &&
        data[7] === discriminator[7]
      );
    }

    for (let i = 0; i < discriminator.length; i++) {
      if (data[i] !== discriminator[i]) return false;
    }
    return true;
  }
}
