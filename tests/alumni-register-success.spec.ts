import { test, expect } from '@playwright/test';

test('เข้าหน้าเว็ปไซต์ Alumni', async ({ page }) => {
  
  const testData = {
  student_id: '2601007',
  name_enrolled: 'สุภาวดี อินทร์คำ',
  masking_identity_value: 'XXXXXXXXX4867',
  identity_value: '7770921604867',
  level_university: 'ปริญญาตรี',
  faculties: 'คณะมนุษยศาสตร์',
  user_status: 'rejected',
  password_unlock_masking: 'CMU123456',
  email: 'banklnwza@gmail.com'
  }

  await page.goto('https://alumni.sck.co.th/login');

  // await page.getByRole('link', { name: 'เจ้าหน้าที่มหาวิทยาลัยเข้าสู่ระบบ' }).click();
  // await page.getByTestId('staff-sign-in-link').click();
  await page.getByRole('button', { name: 'เข้าสู่ระบบด้วย CMU Account' }).click();

  // await page.getByRole('textbox', { name: 'username' }).fill('CentralAdmin');
  await page.getByPlaceholder('Enter any user/subject').fill('CentralAdmin');

  await page.getByPlaceholder('Optional claims JSON value,').fill('{ "oid": "000000ca-0000-0000-0000-000000000019", "email": "central.admin.19@cmu.ac.th" }');

  await page.getByRole('button', { name: 'Sign-in' }).click();
  // await page.locator('xpath=//button').click();

  await expect(page.getByTestId('admin-dashboard-title')).toContainText('Central Admin Dashboard');

  await page.getByTestId('desktop-admin-nav-road-shows').click();
  await page.getByRole('row', { name: 'CMU Reuninon เชียงราย' }).getByTestId('open-desk-button').click();
  await page.getByTestId('desk-search-input').fill(testData.student_id);
  await page.getByTestId('desk-search-button').click();

  // --------Validate Wording----------

  // await expect(page.getByText('สุภาวดี อินทร์คำ')).toContainText('สุภาวดี อินทร์คำ');
  await expect(page.locator('//*[@id="app"]/main/div/div[4]/table/tbody/tr/td[1]/div[1]')).toContainText(testData.name_enrolled);
  
  // await expect(page.getByRole('cell', { name: '2601007' })).toContainText('2601007');
  await expect(page.locator('//*[@id="app"]/main/div/div[4]/table/tbody/tr/td[2]')).toContainText(testData.student_id);

  // await expect(page.getByText('XXXXXXXXX4867')).toContainText('XXXXXXXXX4867');
  await expect(page.locator('//*[@id="app"]/main/div/div[4]/table/tbody/tr/td[3]/div')).toContainText(testData.masking_identity_value);

  await page.getByTestId('toggle-national-id').click();
  await page.getByTestId('input-master-key').fill(testData.password_unlock_masking);
  // await page.getByTestId('input-master-key').fill('CMU123456');
  await page.getByTestId('pin-confirm-button').click();

  await expect(page.locator('//*[@id="app"]/main/div/div[4]/table/tbody/tr/td[3]/div')).toContainText(testData.identity_value);
  // await page.getByText('7770921604867').click();

  // await expect(page.getByText('ปริญญาตรี')).toContainText('ปริญญาตรี');
  await expect(page.locator('//*[@id="app"]/main/div/div[4]/table/tbody/tr/td[4]/span')).toContainText(testData.level_university);

  // await expect(page.getByText('คณะมนุษยศาสตร์')).toContainText('คณะมนุษยศาสตร์');
  await expect(page.locator('//*[@id="app"]/main/div/div[4]/table/tbody/tr/td[4]/div')).toContainText(testData.faculties);

  await expect(page.getByTestId('account-status')).toContainText(testData.user_status);

  await expect(page.getByTestId('issue-qr-button')).toBeVisible();

  await page.getByTestId('issue-qr-button').click();
    await expect(page.getByTestId('desk-qr-subject')).toContainText(testData.name_enrolled);

  // ลิงก์เป็น target="_blank" rel="noopener" -> ไม่ยิง event 'popup' ต้องดัก 'page' ที่ context
  // ตั้ง promise รอไว้ก่อนคลิก แล้วค่อย await หลังคลิก
  const scanPagePromise = page.context().waitForEvent('page');
  await page.getByTestId('desk-qr-link').click();
  const scanPage = await scanPagePromise;
  await scanPage.waitForLoadState();

  await expect(scanPage.getByTestId('scan-heading')).toContainText('ลงทะเบียนนักศึกษาเก่า สำหรับ' + testData.name_enrolled);

  await scanPage.getByTestId('scan-consent-accepted').click();
  await scanPage.getByTestId('scan-publicity-accepted').click();
  await scanPage.getByTestId('scan-next').click();

  await scanPage.getByTestId('short-form-email').fill(testData.email);
  await scanPage.getByTestId('short-form-password').fill(testData.password_unlock_masking);
  await scanPage.getByTestId('short-form-submit').click();

  await expect(scanPage.getByTestId('scan-done-heading')).toContainText('ส่งคำขอลงทะเบียนแล้ว')

  // Tear Down for Repeatability

  await page.goto('https://alumni.sck.co.th/admin/approvals');

  await expect(page.getByRole('row', { name: '560110201' })).toContainText('ปวีณา ใจแก้ว');
  const row = page.getByRole('row', { name: testData.student_id });
  await expect(row).toContainText(testData.name_enrolled);
  await row.getByTestId('reject-button').click();







});
