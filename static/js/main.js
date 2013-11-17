exports.getAuthorClassName = function(author)
{
  return "ep_real_time_chat-" + author.replace(/[^a-y0-9]/g, function(c)
  {
    if (c == ".") return "-";
    return 'z' + c.charCodeAt(0) + 'z';
  });
}

exports.handleClientMessage_CUSTOM = function(hook, context, cb){
  var action = context.payload.action;
  var padId = context.payload.padId;
  var authorId = context.payload.authorId;
  var message = context.payload.message;
  var authorName = context.payload.authorName;
  var authorClass = exports.getAuthorClassName(authorId);
  var authorClassCSS = authorClass.replace("ep_real_time_title","author");

  if(pad.getUserId() === authorId) return false; // Dont process our own caret position (yes we do get it..) -- This is not a bug

  if(action === 'recieveTitleMessage'){ // an author has sent this client a title message update, we need to show it in the dom

    var authorName = decodeURI(escape(context.payload.authorName));
    if(authorName == "null"){
      var authorName = "Anonymous" // If the users username isn't set then display a smiley face
    }
    $('#title > h1').text(message);
  }
}

function sendTitle(){
  var myAuthorId = pad.getUserId();
  var padId = pad.getPadId();
  var message = $('#chatinput').val();
  // Send chat message to send to the server
  var message = {
    type : 'chat',
    action : 'sendTitleMessage',
    message : message,
    padId : padId,
    myAuthorId : myAuthorId
  }
  pad.collabClient.sendMessage(message);  // Send the chat position message to the server
}
