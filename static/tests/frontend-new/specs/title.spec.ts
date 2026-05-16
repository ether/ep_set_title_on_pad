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

  test('Title-bar elements have accessible names (ether/etherpad#7255)', async ({page}) => {
    // Edit / save buttons + input each carry an aria-labelledby pointing at a
    // visually-hidden translated label. Verify the resolved accessible name
    // so a future template tweak that drops the labelledby (or the label
    // element) fails this assertion instead of silently regressing AT UX.
    const edit = page.locator('#edit_title');
    await expect(edit).toHaveAttribute('aria-labelledby', 'edit_title_label');
    await expect(edit).toHaveRole('button');

    const input = page.locator('#input_title');
    await expect(input).toHaveAttribute('aria-labelledby', 'input_title_label');

    const save = page.locator('#save_title button');
    await expect(save).toHaveAttribute('aria-labelledby', 'save_title_label');

    // Loading-state aria-label leak: html10n auto-populates aria-label on
    // the element carrying data-l10n-id (PR #7584). If that element was the
    // outer <a>, the stale "Loading..." aria-label would survive the title
    // swap. By scoping data-l10n-id to a child <span> and replacing the
    // anchor's contents on save, no aria-label should remain on the <a>.
    await edit.click();
    await page.locator('#input_title').fill('Test');
    await page.locator('#save_title').click();
    const anchor = page.locator('#pad_title > #title > h1 > a');
    await expect(anchor).toHaveText('Test');
    await expect(anchor).not.toHaveAttribute('aria-label', /.+/);
    await expect(anchor).not.toHaveAttribute('data-l10n-aria-label', /.+/);
    await expect(anchor).not.toHaveAttribute('data-l10n-id', /.+/);
  });
});
