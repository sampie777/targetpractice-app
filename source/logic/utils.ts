import { Buffer } from "buffer";

export const stringToBytes = (text: string) => {
  const buffer = new Buffer(text, 'utf8');
  return Array.from(buffer.values());
}

export const bytesToString = (bytes: Uint8Array) => {
  const buffer = Buffer.from(bytes);
  return buffer.toString();
}
