import { expect } from '@playwright/test';

export async function loginAsUser(page, email = 'system.tester@gmail.com') {
  await page.goto('/auth/login'); // Uses baseURL from config

  // Fill credentials
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('123456');

  // Click login
  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  // Wait for redirect to home or dashboard
  await page.waitForURL('/home'); 

}



export async function deleteCartContext(page) {

  const originalUrl = page.url();

  await page.goto('/carts'); 
  await page.waitForLoadState('networkidle');

  const deleteAllBtn = page.getByText('Xóa hết giỏ hàng');

  if (await deleteAllBtn.isVisible()) {
    await deleteAllBtn.click();
    
    await page.getByRole('button', { name: 'Đồng ý' }).click();

    await expect(page.getByRole('link', { name: 'Mua sắm ngay' })).toBeVisible();
  }

  if (originalUrl !== page.url()) {
    await page.goto(originalUrl);
    await page.waitForLoadState('networkidle');
  }
}