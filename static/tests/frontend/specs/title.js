'use strict';

describe('Set Title On Pad', function () {
  // create a new pad before each test run
  beforeEach(function (cb) {
    helper.newPad(cb);
    this.timeout(60000);
  });

  // Create Pad
  // Check Default Pad Title is Untitled
  // Set Pad title & Ensure it's right
  // Re-open Pad and check Pad Title is stored.

  it('Checked Default Pad Title is padId', async function () {
    this.timeout(60000);
    const chrome$ = helper.padChrome$;
    chrome$('#edit_title').click();
    chrome$('#input_title').val('JohnMcLear');
    chrome$('#save_title').click();
    await helper.waitForPromise(
        () => chrome$('#pad_title > #title > h1 > a').text() === 'JohnMcLear');
    expect(chrome$('#pad_title > #title > h1 > a').text()).to.be('JohnMcLear');
  });

  it('Check updating pad title to "JohnMcLear" works', async function () {
    this.timeout(60000);
    const chrome$ = helper.padChrome$;
    chrome$('#edit_title').click();
    chrome$('#input_title').val('JohnMcLear');
    chrome$('#save_title').click();

    await helper.waitForPromise(() => {
      console.log(chrome$('#pad_title > #title > h1 > a').text());
      return chrome$('#pad_title > #title > h1 > a').text() === 'JohnMcLear';
    });
    expect(chrome$('#pad_title > #title > h1 > a').text()).to.be('JohnMcLear');
  });
});
