/**
 * Generate RSA-2048 key pair for LianLian Pay Thailand.
 *
 * Usage:
 *   node scripts/generate-lianlian-keys.mjs
 *
 * - Keep PRIVATE key in .env (LIANLIAN_PRIVATE_KEY) — never share
 * - Upload PUBLIC key (base64 body) to LianLian Merchant Portal → public key maintenance
 * - Download LianLian platform public key from portal → put in LIANLIAN_PUBLIC_KEY
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

function pemBody(pem) {
  return pem
    .replace(/-----BEGIN[\s\S]+?-----/g, "")
    .replace(/-----END[\s\S]+?-----/g, "")
    .replace(/\s+/g, "");
}

const outDir = path.join(process.cwd(), "scripts", "lianlian-keys");
fs.mkdirSync(outDir, { recursive: true });

const privatePemPath = path.join(outDir, "merchant-private.pem");
const publicPemPath = path.join(outDir, "merchant-public.pem");
const publicB64Path = path.join(outDir, "merchant-public-base64.txt");
const envSnippetPath = path.join(outDir, "env-snippet.txt");

fs.writeFileSync(privatePemPath, privateKey, "utf8");
fs.writeFileSync(publicPemPath, publicKey, "utf8");
fs.writeFileSync(publicB64Path, pemBody(publicKey) + "\n", "utf8");

const envPrivate = privateKey.replace(/\n/g, "\\n");
const envSnippet = `# Paste into .env (do NOT commit)
LIANLIAN_PRIVATE_KEY="${envPrivate}"

# Upload this public key (base64) to LianLian merchant portal:
# ${pemBody(publicKey).slice(0, 48)}...
`;

fs.writeFileSync(envSnippetPath, envSnippet, "utf8");

console.log("Generated LianLian RSA keys:");
console.log(`  Private PEM : ${privatePemPath}`);
console.log(`  Public PEM  : ${publicPemPath}`);
console.log(`  Public b64  : ${publicB64Path}  ← ส่ง/อัปโหลดให้ทีม LianLian`);
console.log(`  Env snippet : ${envSnippetPath}`);
console.log("");
console.log("⚠ อย่า commit โฟลเดอร์ scripts/lianlian-keys/");
console.log("  เพิ่มใน .gitignore แล้ว (ถ้ายังไม่มี)");
