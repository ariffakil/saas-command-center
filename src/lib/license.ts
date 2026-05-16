// Deterministic activation license generator for desktop subscribers.
// Combines subscriber id + device serial + expiry into a checksummed key.
// Format: XXXX-XXXX-XXXX-XXXX-XXXX (Base32-style, no I/O/0/1)

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 chars

function hash(input: string): bigint {
  // FNV-1a 64-bit
  let h = 1469598103934665603n;
  const prime = 1099511628211n;
  const mask = (1n << 64n) - 1n;
  for (let i = 0; i < input.length; i++) {
    h ^= BigInt(input.charCodeAt(i));
    h = (h * prime) & mask;
  }
  return h;
}

function toBase32(n: bigint, length: number): string {
  let out = "";
  let v = n;
  for (let i = 0; i < length; i++) {
    out = ALPHABET[Number(v & 31n)] + out;
    v >>= 5n;
  }
  return out;
}

export function generateLicense(opts: {
  subscriberId: string;
  serial: string;
  expiry: string;
}): string {
  const seed = `${opts.subscriberId}|${opts.serial.trim().toUpperCase()}|${opts.expiry}`;
  const h1 = hash(seed);
  const h2 = hash(seed + "|checksum");
  const raw = toBase32(h1, 16) + toBase32(h2, 4);
  return raw.match(/.{1,4}/g)!.join("-");
}
