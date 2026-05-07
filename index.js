'use strict';

const db = require('ep_etherpad-lite/node/db/DB').db;
const padMessageHandler = require('ep_etherpad-lite/node/handler/PadMessageHandler');
const {padToggle} = require('ep_plugin_helpers/pad-toggle-server');

// Remove cache for this procedure
db.dbSettings.cache = 0;

// Parallel User Settings + Pad Wide Settings checkboxes for "Show Title".
// Helper owns the storage, broadcast, enforce, and i18n wiring. The pad
// creator can enforce the pad-wide value to lock the title bar visible (or
// hidden) for every viewer.
const titleToggle = padToggle({
  pluginName: 'ep_set_title_on_pad',
  settingId: 'title',
  l10nId: 'ep_set_title_on_pad.show_title',
  defaultLabel: 'Show Title',
  defaultEnabled: true,
});

exports.loadSettings = titleToggle.loadSettings;
exports.eejsBlock_mySettings = titleToggle.eejsBlock_mySettings;
exports.eejsBlock_padSettings = titleToggle.eejsBlock_padSettings;

// Compose padToggle's clientVars with the legacy title-text broadcast that
// fires when a client connects (delivers the saved title via CUSTOM message).
// Only one clientVars hook can be registered per part in ep.json, so we merge
// here. padToggle.clientVars returns the visibility state for clientVars;
// the title-broadcast side-effect runs in parallel.
exports.clientVars = async (hookName, context) => {
  const padId = context.pad.id;
  // Fire the saved-title broadcast (legacy behavior — kept verbatim).
  db.get(`title:${padId}`, (err, value) => {
    const msg = {
      type: 'COLLABROOM',
      data: {
        type: 'CUSTOM',
        payload: {
          action: 'recieveTitleMessage',
          padId,
          message: value,
        },
      },
    };
    setTimeout(() => {
      padMessageHandler.handleCustomObjectMessage(msg, false, () => {});
    }, 100);
  });
  // Return the padToggle's clientVars contribution so the helper picks up
  // pad-wide state on the client.
  return await titleToggle.clientVars(hookName, context);
};

exports.exportFileName = (hook, padId, callback) => {
  let title = padId;
  // Sets Export File Name to the same as the title
  db.get(`title:${padId}`, (err, value) => {
    console.log('Found ', value, ' for ', padId);
    if (value) title = value;
    callback(title);
  });
};

exports.padRemove = async (hookName, {pad}) => {
  await db.remove(`title:${pad.id}`);
};

exports.padCopy = async (hookName, {srcPad, dstPad}) => {
  const title = await db.get(`title:${srcPad.id}`);
  if (title) await db.set(`title:${dstPad.id}`, title);
};
