/***
*
* Responsible for negotiating messages between two clients
*
****/

var authorManager = require("../../src/node/db/AuthorManager"),
padMessageHandler = require("../../src/node/handler/PadMessageHandler"),
               db = require('ep_etherpad-lite/node/db/DB').db,
            async = require('../../src/node_modules/async');



// Remove cache for this procedure
db['dbSettings'].cache = 0;

var buffer = {};

/*
* Handle incoming messages from clients
*/
exports.handleMessage = async function(hook_name, context, callback){
  // Firstly ignore any request that aren't about chat
  var isTitleMessage = false;
  if(context){
    if(context.message && context.message){
      if(context.message.type === 'COLLABROOM'){
        if(context.message.data){
          if(context.message.data.type){
            if(context.message.data.type === 'title'){
              isTitleMessage = true;
            }
          }
        }
      }
    }
  }

  if(!isTitleMessage){
    callback(false);
    return false;
  }
  var message = context.message.data;
  /***
    What's available in a message?
     * action -- The action IE chatPosition
     * padId -- The padId of the pad both authors are on
     * targetAuthorId -- The Id of the author this user wants to talk to
     * message -- the actual message
     * myAuthorId -- The Id of the author who is trying to talk to the targetAuthorId
  ***/
  if(message.action === 'sendTitleMessage'){
    var authorName = await authorManager.getAuthorName(message.myAuthorId); // Get the authorname
    var msg = {
      type: "COLLABROOM",
      data: { 
        type: "CUSTOM",
        payload: {
          action: "recieveTitleMessage",
          authorId: message.myAuthorId,
          authorName: authorName,
          padId: message.padId,
          message: message.message
        }
      }
    };
    sendToRoom(message, msg);
    saveRoomTitle(message.padId, message.message);
  }

  if(isTitleMessage === true){
    callback([null]);
  }else{
    callback(true);
  }
}

function saveRoomTitle(padId, message){
  db.set("title:"+padId, message);
}

function sendToRoom(message, msg){
  var bufferAllows = true; // Todo write some buffer handling for protection and to stop DDoS -- myAuthorId exists in message.
  if(bufferAllows){
    setTimeout(function(){ // This is bad..  We have to do it because ACE hasn't redrawn by the time the chat has arrived
      padMessageHandler.handleCustomObjectMessage(msg, false, function(){
        // TODO: Error handling.
      })
    }
    , 100);
  }
}

exports.clientVars = function(hook, pad, callback){
  var padId = pad.pad.id;
  db.get("title:"+padId, function(err, value){

    var msg = {
      type: "COLLABROOM",
      data: {
        type: "CUSTOM",
        payload: {
          action: "recieveTitleMessage",
          padId: padId,
          message: value
        }
      }
    }
    sendToRoom(false, msg);
  });
  return callback();
}
