// Encrypts the readable pages in src/ (kept out of git) into the published pages,
// each behind the same password prompt (gate.html).
// Usage: node encrypt.mjs <password>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { webcrypto as crypto } from 'node:crypto';

const PAGES = { 'src/hub.html': 'index.html', 'src/eggs.html': 'eggs/index.html', 'src/couch.html': 'couch/index.html' };
const password = process.argv[2];
if (!password) { console.error('usage: node encrypt.mjs <password>'); process.exit(1); }
const ITER = 600000;
const root = new URL('./', import.meta.url).pathname;
const tpl = readFileSync(root + 'gate.html', 'utf8');
const b64 = (u) => Buffer.from(u).toString('base64');

for (const [src, out] of Object.entries(PAGES)) {
  const plain = readFileSync(root + src);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain));
  const payload = JSON.stringify({ iter: ITER, salt: b64(salt), iv: b64(iv), ct: b64(ct) });
  mkdirSync(dirname(root + out), { recursive: true });
  writeFileSync(root + out, tpl.replace('__PAYLOAD__', payload));
  console.log(`${out}: ${plain.length} bytes encrypted`);
}
