import { expect, type Page } from '@playwright/test';

// Processing tests verify the actual downloaded bytes. Picker-specific tests exercise Save as.
export async function downloadFirstResult(page: Page): Promise<void> {
  const save = page.getByTestId('save-result').first();
  await expect(save).toBeVisible({ timeout: 180_000 });
  const fallback = page.getByRole('button', { name: 'Download instead', exact: true }).first();
  if (await fallback.isVisible()) await fallback.click();
  else await save.click();
}
