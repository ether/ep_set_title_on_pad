'use strict';

const db = require('ep_etherpad-lite/node/db/DB');
const padMessageHandler = require('ep_etherpad-lite/node/handler/PadMessageHandler');
const {padToggle} = require('ep_plugin_helpers/pad-toggle-server');

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
  let value;
  try {
    value = await db.get(`title:${padId}`);
  } catch (err) {
    console.error('ep_set_title_on_pad clientVars db.get failed:', err);
  }
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
  // Return the padToggle's clientVars contribution so the helper picks up
  // pad-wide state on the client.
  return await titleToggle.clientVars(hookName, context);
};

exports.exportFileName = async (hook, padId) => {
  // ueberdb2 v6 is promise-only; the legacy db.get(key, cb) callback never
  // fires, which previously hung the export pipeline when the export hook's
  // callback was placed inside it.
  try {
    const value = await db.get(`title:${padId}`);
    if (value) return value;
  } catch (err) {
    console.error('ep_set_title_on_pad exportFileName db.get failed:', err);
  }
  return padId;
};

exports.padRemove = async (hookName, {pad}) => {
  await db.remove(`title:${pad.id}`);
};

exports.padCopy = async (hookName, {srcPad, dstPad}) => {
  const title = await db.get(`title:${srcPad.id}`);
  if (title) await db.set(`title:${dstPad.id}`, title);
};
