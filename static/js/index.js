'use strict';

exports.handleClientMessage_CUSTOM = (hook, context, cb) => {
  if (context.payload.action === 'recieveTitleMessage') {
    const message = context.payload.message;
    if (!$('#input_title').is(':visible')) { // if we're not editing..
      if (message) {
        window.document.title = message;
        $('#title > h1 > a').text(message);
        $('#input_title').val(message);
        clientVars.ep_set_title_on_pad = {};
        clientVars.ep_set_title_on_pad.title = message;
      }
    }
  }
  cb(null);
};

const sendTitle = () => {
  const myAuthorId = pad.getUserId();
  const padId = pad.getPadId();
  const title = $('#input_title').val();
  // Send chat message to send to the server
  const message = {
    type: 'title',
    action: 'sendTitleMessage',
    message: title,
    padId,
    myAuthorId,
  };
  pad.collabClient.sendMessage(message); // Send the chat position message to the server
};

exports.documentReady = () => {
  $('#options-title').click(() => {
    $('#pad_title').toggleClass('display_important');
    $('#pad_title').toggleClass('flex_title');
  });

  if(!clientVars.ep_set_title_on_pad){
    $('#title > h1 > a').text(clientVars.padId);
  }

  if (!$('#editorcontainerbox').hasClass('flex-layout')) {
    $.gritter.add({
      title: 'Error',
      text: 'ep_set_title_on_pad: Please upgrade to etherpad 1.8.3+ for this plugin to work correctly',
      sticky: true,
      class_name: 'error',
    });
  }

  $('#edit_title').show();

  $('#edit_title').click(() => {
    $('#input_title, #save_title').show();
    $('#title, #edit_title').hide();
    $('#input_title').focus();
  });

  $('#save_title').click(() => {
    sendTitle();
    window.document.title = $('#input_title').val();
    $('#title > h1 > a').text($('#input_title').val());
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
