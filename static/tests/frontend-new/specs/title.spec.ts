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

  // Regression guard for #155: the bar was once squeezed to 16px tall with
  // 11px text to keep a since-removed core auto-scroll assertion green, which
  // rendered the title smaller than the pad's own body copy.
  test('title bar is rendered at a readable size', async ({page}) => {
    const metrics = await page.evaluate(() => {
      const bar = document.querySelector('#pad_title') as HTMLElement;
      const heading = document.querySelector('#pad_title #title h1') as HTMLElement;
      return {
        barHeight: bar.getBoundingClientRect().height,
        titleFontSize: parseFloat(getComputedStyle(heading).fontSize),
        // Core sets `html { font-size: 15px }`; the title must not end up
        // smaller than the editor's own base text.
        rootFontSize: parseFloat(getComputedStyle(document.documentElement).fontSize),
      };
    });

    expect(metrics.titleFontSize).toBeGreaterThanOrEqual(metrics.rootFontSize);
    expect(metrics.barHeight).toBeGreaterThanOrEqual(metrics.rootFontSize * 2);
  });
});
