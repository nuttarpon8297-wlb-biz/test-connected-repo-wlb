import { test, expect } from '@playwright/test';

test('เข้าหน้าเว็ปไซต์ Alumni', async ({ page }) => {
  
  const testData = {
  student_id: '077012',
  name_enrolled: 'วรวิทย์ แพทย์ไทย',
  masking_identity_value: 'XXXXXXXXX0731',
  identity_value: '2237702540731',
  level_university: 'ปริญญาตรี',
  faculties: 'คณะแพทยศาสตร์',
  // user_status: 'rejected',
  password_unlock_masking: 'CMU123456',
  email: 'banklnwza2@gmail.com'
  }

  await page.goto('https://alumni.sck.co.th/login');


  await page.getByRole('button', { name: 'เข้าสู่ระบบด้วย CMU Account' }).click();

  await page.getByPlaceholder('Enter any user/subject').fill('CentralAdmin');

  await page.getByPlaceholder('Optional claims JSON value,').fill('{ "oid": "000000ca-0000-0000-0000-000000000019", "email": "central.admin.19@cmu.ac.th" }');

  await page.getByRole('button', { name: 'Sign-in' }).click();

  await expect(page.getByTestId('admin-dashboard-title')).toContainText('Central Admin Dashboard');

  await page.getByTestId('desktop-admin-nav-road-shows').click();
  await page.getByRole('row', { name: 'CMU Reuninon เชียงราย' }).getByTestId('open-desk-button').click();
  await page.getByTestId('desk-search-input').fill(testData.student_id);
  await page.getByTestId('desk-search-button').click();

  // --------Validate Wording----------

  await expect(page.locator('//*[@id="app"]/main/div/div[4]/table/tbody/tr/td[1]/div[1]')).toContainText(testData.name_enrolled);
  
  await expect(page.locator('//*[@id="app"]/main/div/div[4]/table/tbody/tr/td[2]')).toContainText(testData.student_id);

  await expect(page.locator('//*[@id="app"]/main/div/div[4]/table/tbody/tr/td[3]/div')).toContainText(testData.masking_identity_value);

  await page.getByTestId('toggle-national-id').click();
  await page.getByTestId('input-master-key').fill(testData.password_unlock_masking);
  await page.getByTestId('pin-confirm-button').click();

  await expect(page.locator('//*[@id="app"]/main/div/div[4]/table/tbody/tr/td[3]/div')).toContainText(testData.identity_value);

  await expect(page.locator('//*[@id="app"]/main/div/div[4]/table/tbody/tr/td[4]/span')).toContainText(testData.level_university);

  await expect(page.locator('//*[@id="app"]/main/div/div[4]/table/tbody/tr/td[4]/div')).toContainText(testData.faculties);

  // await expect(page.getByTestId('account-status')).toContainText(testData.user_status);

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

  await expect(page.getByRole('row', { name: testData.student_id })).toContainText(testData.name_enrolled);
  const row = page.getByRole('row', { name: testData.student_id });
  await expect(row).toContainText(testData.name_enrolled);
  await row.getByTestId('reject-button').click();

  await page.getByTestId('reject-reason-select').selectOption({ value: 'data_mismatch' });
  await page.getByTestId('reject-confirm-button').click();







});
