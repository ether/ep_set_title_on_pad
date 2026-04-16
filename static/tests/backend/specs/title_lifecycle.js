'use strict';

const assert = require('assert').strict;
const common = require('ep_etherpad-lite/tests/backend/common');
const padManager = require('ep_etherpad-lite/node/db/PadManager');
const DB = require('ep_etherpad-lite/node/db/DB');

const titleKey = (padId) => `title:${padId}`;

describe(__filename, function () {
  before(async function () {
    await common.init();
  });

  it('removes the title when the pad is removed (regression for #109)', async function () {
    const padId = `title-rm-${common.randomString()}`;
    const pad = await padManager.getPad(padId, '\n');
    await DB.set(titleKey(padId), 'My Pad Title');
    assert.equal(await DB.get(titleKey(padId)), 'My Pad Title');

    await pad.remove();

    // Different DB drivers return either null or undefined for missing keys.
    assert(await DB.get(titleKey(padId)) == null);
  });

  it('copies the title when the pad is copied', async function () {
    const srcId = `title-cp-src-${common.randomString()}`;
    const dstId = `title-cp-dst-${common.randomString()}`;
    const src = await padManager.getPad(srcId, '\n');
    await DB.set(titleKey(srcId), 'Original Title');

    await src.copy(dstId);

    assert.equal(await DB.get(titleKey(dstId)), 'Original Title');

    // cleanup
    const dst = await padManager.getPad(dstId);
    await src.remove();
    await dst.remove();
  });
});
