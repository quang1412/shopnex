import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can go on homepage', async ({ page }) => {
    const response = await page.goto('http://localhost:3000')

    expect(response?.status()).toBe(200)
  })
})
