# LianLian Pay Thailand — คู่มือตั้งค่า (Momotaro Shop)

เอกสารอ้างอิง: [Getting Started](https://doc.lianlianpay.co.th/docs/getting-started) · [Quick Start](https://doc.lianlianpay.co.th/docs/quick-start) · [Checkout](https://doc.lianlianpay.co.th/docs/checkout) · [Signature](https://doc.lianlianpay.co.th/docs/signature) · [Webhook](https://doc.lianlianpay.co.th/docs/webhook)

IT Support: [support-thaipay@lianlianpay.com](mailto:support-thaipay@lianlianpay.com)

---

## สรุปสั้น ๆ — คุณต้องใช้อะไรบ้าง

| รายการ | ได้จากไหน | ใส่ที่ไหน |
|--------|-----------|----------|
| `LIANLIAN_MERCHANT_ID` | ทีม LianLian / Merchant Portal (ขึ้นต้นด้วย `14`) | `.env` |
| `LIANLIAN_STORE_ID` (ถ้ามี) | ทีม LianLian | `.env` (optional) |
| `LIANLIAN_PRIVATE_KEY` | สร้างเองด้วยสคริปต์ด้านล่าง | `.env` (เก็บลับ) |
| Merchant Public Key | คู่กับ private key ข้างบน | **อัปโหลดเข้า Merchant Portal** |
| `LIANLIAN_PUBLIC_KEY` | ดาวน์โหลดจาก Merchant Portal (คีย์ของ LianLian) | `.env` |
| `NEXT_PUBLIC_SITE_URL` | URL เว็บจริง (HTTPS) | `.env` |
| Webhook URL | เราเตรียมไว้แล้ว | แจ้งทีม LianLian / ใช้ตอนเรียก API |

โหมดที่เชื่อมไว้: **Checkout Page** (`llpth.checkout.apply`) — ลูกค้าถูกพาไปหน้าชำระเงินของ LianLian (PromptPay / บัตร / e-wallet ตามที่เปิดบัญชีไว้)

---

## สิ่งที่ต้องส่งให้ทีม LianLian

ส่งอีเมลไปที่ `support-thaipay@lianlianpay.com` (หรือ AM ที่ดูแลคุณ) พร้อม:

1. **Merchant Public Key (Base64)**  
   ไฟล์จากสคริปต์: `scripts/lianlian-keys/merchant-public-base64.txt`  
   หรืออัปโหลดเองใน Portal → Public key maintenance

2. **URL เว็บไซต์ production**  
   เช่น `https://your-domain.com`

3. **Webhook / Notify URL**  
   `https://your-domain.com/api/payments/lianlian/notify`

4. **Redirect URL (หลังชำระเงิน)**  
   `https://your-domain.com/api/payments/lianlian/redirect`

5. **Cancel URL**  
   `https://your-domain.com/checkout/fail`

6. **ข้อมูลร้าน** (ถ้ายังไม่ได้เปิดบัญชี)  
   ชื่อร้าน, เลขทะเบียนนิติบุคคล, ผู้ติดต่อ, เบอร์, อีเมล, บัญชีรับเงิน

7. **ช่องทางชำระเงินที่ต้องการเปิด**  
   เช่น Thai QR / PromptPay, บัตรเครดิต, True Pay, TrueMoney, ShopeePay, Mobile Banking ฯลฯ

เทมเพลตอีเมลสั้น ๆ:

```text
Subject: Merchant integration — Momotaro Shop (Checkout API)

สวัสดีครับ ต้องการเชื่อมต่อ LianLian Checkout API

1) Merchant Public Key (RSA-2048, Base64):
<วางจาก merchant-public-base64.txt>

2) Production site: https://YOUR_DOMAIN
3) Notify URL: https://YOUR_DOMAIN/api/payments/lianlian/notify
4) Redirect URL: https://YOUR_DOMAIN/api/payments/lianlian/redirect
5) Cancel URL: https://YOUR_DOMAIN/checkout/fail

รบกวนขอ:
- Merchant ID (sandbox + production)
- Store ID (ถ้ามี)
- วิธีดาวน์โหลด LianLian platform public key
- เปิดช่องทาง: Thai QR, Card, ...

ขอบคุณครับ
```

---

## สิ่งที่ทีม LianLian จะส่งกลับมาให้คุณ

- `merchant_id` (sandbox / production)
- `store_id` (ถ้ามี)
- Username/password Merchant Portal (sandbox + production)
- ยืนยันว่าอัปโหลด public key แล้ว
- รายการ payment product ที่เปิดให้ใช้

จากนั้นคุณดาวน์โหลด **LianLian public key** จาก Portal มาใส่ `LIANLIAN_PUBLIC_KEY`

---

## ขั้นตอนตั้งค่า (ทีมเรา)

### 1) สร้าง RSA key pair

```bash
node scripts/generate-lianlian-keys.mjs
```

จะได้โฟลเดอร์ `scripts/lianlian-keys/` (อย่า commit)

### 2) กรอก `.env`

คัดลอกจาก `env.example` แล้วเติมค่า:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com

LIANLIAN_ENV=sandbox
LIANLIAN_MERCHANT_ID=14xxxxxxxxxxxxxxxx
# LIANLIAN_STORE_ID=
LIANLIAN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
LIANLIAN_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"

# optional — ถ้าไม่ใส่ หน้า checkout จะโชว์ทุกช่องทางที่เปิดบัญชีไว้
# LIANLIAN_PRODUCT_CODE=
# LIANLIAN_PAYMENT_METHOD=
```

รองรับทั้งรูปแบบ PEM และ raw Base64 (ตามที่ Portal ให้มา)

### 3) ทดสอบใน Sandbox

| รายการ | URL |
|--------|-----|
| Gateway | `https://sandbox-th.lianlianpay-inc.com/gateway` |
| Merchant Portal | `https://sandbox-th-merchant.lianlianpay-inc.com/user/login` |

1. รันเว็บ (ต้องเข้าถึง webhook ได้ — ใช้ ngrok/cloudflare tunnel ถ้า local)
2. ตั้ง `NEXT_PUBLIC_SITE_URL` ให้ชี้ URL สาธารณะนั้น
3. สั่งซื้อ → กดชำระเงิน → ควรเด้งไปหน้า Checkout ของ LianLian
4. ชำระสำเร็จ → กลับ `/checkout/success` และมี webhook ที่ `/api/payments/lianlian/notify`

### 4) ขึ้น Production

1. สลับ `LIANLIAN_ENV=production`
2. ใส่ `merchant_id` / keys ของ production
3. ตั้ง `NEXT_PUBLIC_SITE_URL` เป็นโดเมนจริง (HTTPS)
4. แจ้งทีม LianLian ให้เปิดใช้งาน production

| รายการ | URL |
|--------|-----|
| Gateway | `https://api.lianlianpay.co.th/gateway` |
| Merchant Portal | `https://merchant.lianlianpay.co.th/user/login` |

---

## สิ่งที่โค้ดในโปรเจกต์เตรียมไว้แล้ว

| ไฟล์ | หน้าที่ |
|------|---------|
| `src/lib/lianlian.ts` | เซ็น RSA-SHA1, สร้าง checkout, query |
| `src/app/api/payments/lianlian/create` | สร้างออเดอร์ + ได้ `link_url` |
| `src/app/api/payments/lianlian/notify` | รับ webhook (ตอบ `{ code: 200000, message: "Success" }`) |
| `src/app/api/payments/lianlian/redirect` | รับ POST หลังชำระ แล้วพาไป success/fail |
| `src/components/cart/CheckoutClient.tsx` | เรียก LianLian แทน Ksher |
| `scripts/generate-lianlian-keys.mjs` | สร้าง key pair |

ระบบเดิมของ Ksher ยังอยู่ใน repo (`/api/payments/ksher/*`) ถ้าต้องการสลับกลับ แก้ endpoint ใน `CheckoutClient` ได้

---

## Flow การชำระเงิน

```
ลูกค้ากดชำระ → POST /api/payments/lianlian/create
  → LianLian llpth.checkout.apply
  → redirect ไป link_url (หน้า Checkout LianLian)
  → ลูกค้าชำระเงิน
  → (1) POST notify_url  (อัปเดตสถานะ paid)
  → (2) POST redirect_url → /checkout/success?order=...
```

สถานะสำคัญ: `PS` = สำเร็จ, `PF` = ล้มเหลว, `PE` = หมดอายุ, `WP` = รอชำระ

---

## Checklist ก่อน Go-live

- [ ] ได้ `merchant_id` sandbox + ทดสอบชำระผ่านแล้ว
- [ ] อัปโหลด merchant public key ใน Portal แล้ว
- [ ] ใส่ `LIANLIAN_PUBLIC_KEY` (คีย์ LianLian) แล้ว — verify webhook ได้
- [ ] Webhook URL เปิดจาก internet ได้ (HTTPS)
- [ ] ตอบ webhook ด้วย `code: 200000` (โค้ดทำให้อยู่แล้ว)
- [ ] ได้ `merchant_id` production + สลับ `LIANLIAN_ENV=production`
- [ ] ทดสอบออเดอร์จริงยอดเล็ก แล้วตรวจเงินเข้าบัญชี
