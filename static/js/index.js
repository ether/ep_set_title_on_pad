exports.handleClientMessage_CUSTOM = function(hook, context, cb){
  var message = context.payload.message;
  if(!$("#input_title").is(":visible")){ // if we're not editing..
    $('#title > h1').text(message);
    $('#input_title').val(message);
  }
}

exports.documentReady = function(){
  var top = $('.toolbar').position().top;
  var bottom = top + $('.toolbar').height();
  $('#editorcontainerbox').css("top", top+"px");
  bottom = bottom+5;
  bottom = bottom+"px";
  $('.stickyChat, #settings, #importexport, #embed, #connectivity, #users').css("top", bottom);

  $('#edit_title').click(function(){
    $('#title').hide();
    $('#input_title').show();
    $('#edit_title').hide();
    $('#save_title').css("display","inline-block");
    $('#input_title').focus();
  });

  $('#save_title').click(function(){
    sendTitle();
    $('#title > h1').text($('#input_title').val());
    $('#title').show();
    $('#input_title').hide();
    $('#edit_title').show();
    $('#save_title').hide();
  });

  $('#input_title').keyup(function(){
    sendTitle();
    $('#title > h1').text($('#input_title').val());
  });
}

function sendTitle(){
  var myAuthorId = pad.getUserId();
  var padId = pad.getPadId();
  var message = $('#input_title').val();
  // Send chat message to send to the server
  var message = {
    type : 'title',
    action : 'sendTitleMessage',
    message : message,
    padId : padId,
    myAuthorId : myAuthorId
  }
  pad.collabClient.sendMessage(message);  // Send the chat position message to the server
}

