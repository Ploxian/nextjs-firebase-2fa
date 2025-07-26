export async function deriveKey(uid) {
  const enc = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-256', enc.encode(uid));
  return crypto.subtle.importKey('raw', hash, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

export async function encrypt(secret, uid) {
  const key = await deriveKey(uid);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(secret);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

  // Convert ArrayBuffer to Uint8Array, then to base64 string
  return {
    cipher: Buffer.from(new Uint8Array(encrypted)).toString('base64'),
    iv: Buffer.from(iv).toString('base64'),
  };
}

export async function decrypt(cipher, iv, uid) {
  const key = await deriveKey(uid);
  const data = Buffer.from(cipher, 'base64');
  const ivBytes = Buffer.from(iv, 'base64');
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: ivBytes }, key, data);
  return new TextDecoder().decode(decrypted);
}
