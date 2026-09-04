import { test, expect } from '@playwright/test';

async function openCleanPage(page, url = '/') {
  await page.goto(url);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

test.describe('Global Time Atlas timezone workflows', () => {
  test('loads the converter and renders all capitals', async ({ page }) => {
    await openCleanPage(page);

    await expect(page).toHaveTitle('Global Time Atlas — Timezone converter');
    await expect(page.locator('.comparison-card')).toHaveCount(3);
    await expect(page.locator('.capitals-section .major-city-row')).toHaveCount(195);
    await expect(page.locator('.capitals-section .major-city-row').filter({ hasText: 'Madrid' })).toHaveCount(1);
  });

  test('searches and selects Barcelona without collapsing it into Madrid', async ({ page }) => {
    await openCleanPage(page);

    await page.locator('.zone-picker-button').nth(1).click();
    const search = page.locator('.zone-menu input');
    await search.fill('Barcelona');
    await expect(page.locator('.zone-options button').first()).toContainText('Barcelona');
    await expect(page.locator('.zone-options button').first()).toContainText('Europe/Madrid');
    await page.locator('.zone-options button').first().click();

    const card = page.locator('.comparison-card').first();
    await expect(card.locator('.zone-picker-button')).toContainText('Barcelona');
    await expect(card.locator('.comparison-region')).toContainText('Barcelona');
    await expect(card.locator('.comparison-region')).toContainText('Europe/Madrid');
    await expect(card.locator('.comparison-time')).toHaveText('3:00 PM');
  });

  test('supports keyboard selection and no-result feedback', async ({ page }) => {
    await openCleanPage(page);

    await page.locator('.zone-picker-button').nth(2).click();
    const search = page.locator('.zone-menu input');
    await search.fill('Singapore');
    await search.press('Enter');
    await expect(page.locator('.comparison-card').nth(1).locator('.zone-picker-button')).toContainText('Singapore');

    await page.locator('.zone-picker-button').nth(2).click();
    await page.locator('.zone-menu input').fill('not-a-real-city');
    await expect(page.locator('.no-results')).toHaveText('No cities found');
    await page.locator('.zone-menu input').press('Escape');
    await expect(page.locator('.zone-menu')).toHaveCount(0);
  });

  test('switches the visible interface between English and Spanish', async ({ page }) => {
    await openCleanPage(page);

    await expect(page.locator('.app-shell')).toContainText('Starting timezone/city');
    await page.locator('.language-toggle').click();
    await expect(page.locator('.app-shell')).toContainText('Zona horaria/ciudad inicial');
    await expect(page.locator('.app-shell')).toContainText('misma fecha');
    await page.locator('.language-toggle').click();
    await expect(page.locator('.app-shell')).toContainText('Starting timezone/city');
  });

  test('restores conversion settings from a shareable URL', async ({ page }) => {
    await openCleanPage(page, '/?date=2026-08-24&time=13%3A00&from=UTC&fromCity=UTC&to=Europe%2FMadrid%2CAmerica%2FNew_York%2CAsia%2FSingapore&cities=Barcelona%2CNew%20York%2CSingapore');

    await expect(page.locator('input[type="date"]')).toHaveValue('2026-08-24');
    await expect(page.locator('input[type="time"]')).toHaveValue('13:00');
    await expect(page.locator('.comparison-card').first().locator('.zone-picker-button')).toContainText('Barcelona');
    await expect(page.locator('.comparison-card').first().locator('.comparison-time')).toHaveText('3:00 PM');
    await expect(page.locator('.comparison-card').first().locator('.comparison-region')).toContainText('Europe/Madrid');
  });
});
