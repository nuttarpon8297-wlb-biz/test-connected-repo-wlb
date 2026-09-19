# e2e-playwright-ui

Playwright end-to-end UI tests สำหรับระบบสารสนเทศด้านนักศึกษาเก่า (Alumni) — https://alumni.sck.co.th

## ความต้องการเบื้องต้น

- Node.js 18 ขึ้นไป
- Google Chrome (เทสรันบน channel `chrome` ไม่ใช่ Chromium ที่มากับ Playwright)

## ติดตั้ง

```bash
npm install
npx playwright install
```

## รันเทส

| คำสั่ง | ใช้ทำอะไร |
|---|---|
| `npm test` | รันทั้งหมดแบบ headless |
| `npm run test:ui` | เปิด UI Mode ดู timeline ย้อนดูแต่ละ step ได้ |
| `npm run test:headed` | รันแบบเห็นเบราว์เซอร์จริง |
| `npm run test:codegen` | บันทึก action เป็นโค้ดอัตโนมัติ |

ดูรายงานหลังรัน: `npx playwright show-report`

## โครงสร้าง

```
tests/
  alumni-register-success.spec.ts   เทสลงทะเบียนนักศึกษาเก่าผ่านโต๊ะ Road Show
playwright.config.ts                config หลัก (testDir, project, reporter)
```

## เทสครอบคลุมอะไร

`alumni-register-success.spec.ts` — flow ลงทะเบียนสำเร็จตั้งแต่ต้นจนจบ

1. เข้าสู่ระบบด้วย CMU Account ในบทบาท Central Admin
2. เข้าหน้ารอบ Road Show แล้วเปิดโต๊ะของรอบที่ต้องการ
3. ค้นหานักศึกษาเก่าด้วยรหัสนักศึกษา แล้วตรวจข้อมูลในตาราง (ชื่อ, รหัส, เลขบัตรที่ถูกมาสก์, ระดับการศึกษา, คณะ)
4. ปลดมาสก์เลขบัตรประชาชนด้วย master key แล้วตรวจเลขเต็ม
5. ออก QR แล้วเปิดฟอร์มลงทะเบียน
6. ยอมรับ consent + publicity กรอกฟอร์มย่อ แล้วส่งคำขอ
7. ตรวจว่าขึ้นข้อความยืนยันว่าส่งคำขอแล้ว

## ข้อควรรู้เวลาแก้เทส

**แท็บใหม่** — ลิงก์ `desk-qr-link` เป็น `target="_blank" rel="noopener"` ทำให้ Playwright **ไม่ยิง event `popup`** ต้องดัก event `page` ที่ระดับ context แทน และต้องตั้ง promise รอไว้ก่อนคลิกเสมอ

```ts
const scanPagePromise = page.context().waitForEvent('page');
await page.getByTestId('desk-qr-link').click();
const scanPage = await scanPagePromise;
```

**Teardown** — ท้ายเทสจะเข้าไปที่ `/admin/approvals` แล้ว reject คำขอที่เพิ่งสร้าง เพื่อให้รันซ้ำได้ ถ้าไม่ล้าง ระบบจะขึ้น "มีคำขอลงทะเบียนรออนุมัติอยู่แล้ว" และรอบถัดไปจะพัง

**ข้อมูลทดสอบ** — `testData` ที่หัวไฟล์อ้างถึงนักศึกษาที่มีอยู่จริงบน environment ทดสอบ ถ้าเปลี่ยนรหัสนักศึกษา ต้องเปลี่ยนชื่อ/คณะ/เลขบัตรให้ตรงกันทั้งชุด

**Locator** — ใช้ `data-testid` เป็นหลัก ส่วนที่ยังเป็น XPath (การตรวจข้อมูลในตารางผลค้นหา) เปราะต่อการเปลี่ยนโครงสร้าง DOM ควรทยอยเปลี่ยนเป็น testid เมื่อฝั่งแอปเพิ่มให้
