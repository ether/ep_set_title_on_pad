exports.handleClientMessage_CUSTOM = function(hook, context, cb){
  if(context.payload.action == "recieveTitleMessage"){
    var message = context.payload.message;
    if(!$("#input_title").is(":visible")){ // if we're not editing..
      if(message){
        window.document.title = message;
        $('#title > h1').text(message);
        $('#input_title').val(message);
      }
    }
  }
}

exports.documentReady = function(){
  var top = $('.toolbar').position().top;
  var bottom = top + $('.toolbar').height();
  var containerTop = $('.toolbar').position().top + $('.toolbar').height() - $('#editbar').height();
  $('#editorcontainerbox').css("top", containerTop+"px");
  var popupTop = bottom+4;
  $('#settings, #importexport, #embed, #connectivity, #users').css("top", popupTop+"px");
  var chatTop = bottom+5;
  $('.stickyChat').css("top", chatTop+"px");

  $('#edit_title').click(function(){
    $('#title').hide();
    $('#input_title').show();
    $('#edit_title').hide();
    $('#save_title').css("display","inline-block");
    $('#input_title').focus();
  });

  $('#save_title').click(function(){
    sendTitle();
    window.document.title = $('#input_title').val();
    $('#title > h1').text($('#input_title').val());
    $('#title').show();
    $('#input_title').hide();
    $('#edit_title').show();
    $('#save_title').hide();
  });

  $('#input_title').keyup(function(){
    sendTitle();
    window.document.title = $('#input_title').val();
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

