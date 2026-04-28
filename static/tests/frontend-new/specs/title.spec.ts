import {expect, test} from '@playwright/test';
import {goToNewPad} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

test.describe('Set Title On Pad', () => {
  test('Updating pad title to "JohnMcLear" works', async ({page}) => {
    await page.locator('#edit_title').click();
    await page.locator('#input_title').fill('JohnMcLear');
    await page.locator('#save_title').click();

    await expect(page.locator('#pad_title > #title > h1 > a')).toHaveText('JohnMcLear');
  });
});
