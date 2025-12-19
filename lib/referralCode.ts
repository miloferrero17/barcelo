import crypto from "crypto"

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // 32 chars, sin O/0/I/1
const BASE = ALPHABET.length

export function generateReferralCode(length = 11) {
  let out = ""
  for (let i = 0; i < length; i++) {
    const idx = crypto.randomInt(0, BASE) // seguro y uniforme
    out += ALPHABET[idx]
  }
  return out
}
