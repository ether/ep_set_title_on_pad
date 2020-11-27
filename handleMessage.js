'use strict';

/* **
 *
 * Responsible for negotiating messages between two clients
 *
 *** */

const authorManager = require('ep_etherpad-lite/node/db/AuthorManager');
const padMessageHandler = require('ep_etherpad-lite/node/handler/PadMessageHandler');
const db = require('ep_etherpad-lite/node/db/DB').db;

// Remove cache for this procedure
db.dbSettings.cache = 0;

const saveRoomTitle = (padId, message) => {
  db.set(`title:${padId}`, message);
};

const sendToRoom = (message, msg) => {
  // This is bad..  We have to do it because ACE hasn't redrawn by the time the chat has arrived
  setTimeout(() => {
    padMessageHandler.handleCustomObjectMessage(msg, false, () => {
      // TODO: Error handling.
    });
  }
  , 100);
};

/*
 * Handle incoming messages from clients
 */
exports.handleMessage = async (hookName, context, cb) => {
  // Firstly ignore any request that aren't about chat
  let message = false;
  if (context.message && context.message.type && context.message.type === 'COLLABROOM') {
    if (context.message.data && context.message.data.type &&
        context.message.data.type === 'title') {
      message = context.message.data;
    }
  }

  if (!message) return;

  /* **
   * What's available in a message?
   *   - action -- The action IE chatPosition
   *   - padId -- The padId of the pad both authors are on
   *   - targetAuthorId -- The Id of the author this user wants to talk to
   *   - message -- the actual message
   *   - myAuthorId -- The Id of the author who is trying to talk to the targetAuthorId
   ** */
  if (message.action === 'sendTitleMessage') {
    const authorName = await authorManager.getAuthorName(message.myAuthorId); // Get the authorname
    const msg = {
      type: 'COLLABROOM',
      data: {
        type: 'CUSTOM',
        payload: {
          action: 'recieveTitleMessage',
          authorId: message.myAuthorId,
          authorName,
          padId: message.padId,
          message: message.message,
        },
      },
    };
    sendToRoom(message, msg);
    saveRoomTitle(message.padId, message.message);
    return null; // handled by plugin
  }
};

exports.clientVars = (hook, pad, callback) => {
  const padId = pad.pad.id;
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
    sendToRoom(false, msg);
  });
  callback();
};
