'use strict';

exports.handleClientMessage_CUSTOM = (hook, context, cb) => {
  if (context.payload.action === 'recieveTitleMessage') {
    const message = context.payload.message;
    const padTitleElement = $('#input_title');
    const titleTag = $('#title > h1 > a');
    if (!padTitleElement.is(':visible')) { // if we're not editing..
      if (message) {
        window.document.title = message;
        titleTag.text(message);
        titleTag.removeAttr('data-l10n-id');
        padTitleElement.val(message);
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

  if (!clientVars.ep_set_title_on_pad) {
    $('#title > h1 > a').text(clientVars.padId);
    $('#title > h1 > a').removeAttr('data-l10n-id');
  }

  if (!$('#editorcontainerbox').hasClass('flex-layout')) {
    $.gritter.add({
      title: 'Error',
      text: 'ep_set_title_on_pad: Upgrade to etherpad 1.8.3+ for this plugin to work correctly',
      sticky: true,
      class_name: 'error', // eslint-disable-line camelcase
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
    $('#title > h1 > a').removeAttr('data-l10n-id');
    $('#title, #edit_title').show();
    $('#input_title, #save_title').hide();
  });

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  $('#input_title').keyup((e) => {
    debounce(sendTitle);
    window.document.title = $('#input_title').val();
    $('#title > h1').text($('#input_title').val());
    if (e.keyCode === 13) {
      $('#save_title').click();
    }
  });
};
