'use strict';

const db = require('ep_etherpad-lite/node/db/DB').db;
const eejs = require('ep_etherpad-lite/node/eejs/');

// Remove cache for this procedure
db.dbSettings.cache = 0;

exports.exportFileName = (hook, padId, callback) => {
  let title = padId;
  // Sets Export File Name to the same as the title
  db.get(`title:${padId}`, (err, value) => {
    console.log('Found ', value, ' for ', padId);
    if (value) title = value;
    callback(title);
  });
};

exports.eejsBlock_mySettings = (hookName, args, cb) => {
  args.content += eejs.require('ep_set_title_on_pad/templates/settings.ejs');
  cb();
};

exports.padRemove = async (hookName, {pad}) => {
  await db.remove(`title:${pad.id}`);
};

exports.padCopy = async (hookName, {srcPad, dstPad}) => {
  const title = await db.get(`title:${srcPad.id}`);
  if (title) await db.set(`title:${dstPad.id}`, title);
};
