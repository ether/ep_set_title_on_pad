exports.handleClientMessage_CUSTOM = function (hook, context, cb) {
  if (context.payload.action == 'recieveTitleMessage') {
    const message = context.payload.message;
    if (!$('#input_title').is(':visible')) { // if we're not editing..
      if (message) {
        window.document.title = message;
        $('#title > h1').text(message);
        $('#input_title').val(message);
      }
    }
  }
};

exports.documentReady = function () {
  if (!$('#editorcontainerbox').hasClass('flex-layout')) {
    $.gritter.add({
      title: 'Error',
      text: 'Ep_set_title_on_pad: Please upgrade to etherpad 1.9 for this plugin to work correctly',
      sticky: true,
      class_name: 'error',
    });
  }
  $('#edit_title').click(() => {
    $('#input_title, #save_title').show();
    $('#title, #edit_title').hide();
    $('#input_title').focus();
  });

  $('#save_title').click(() => {
    sendTitle();
    window.document.title = $('#input_title').val();
    $('#title > h1').text($('#input_title').val());
    $('#title, #edit_title').show();
    $('#input_title, #save_title').hide();
  });

  $('#input_title').keyup((e) => {
    sendTitle();
    window.document.title = $('#input_title').val();
    $('#title > h1').text($('#input_title').val());
    if (e.keyCode === 13) {
      $('#save_title').click();
    }
  });
};

function sendTitle() {
  const myAuthorId = pad.getUserId();
  const padId = pad.getPadId();
  var message = $('#input_title').val();
  // Send chat message to send to the server
  var message = {
    type: 'title',
    action: 'sendTitleMessage',
    message,
    padId,
    myAuthorId,
  };
  pad.collabClient.sendMessage(message); // Send the chat position message to the server
}
