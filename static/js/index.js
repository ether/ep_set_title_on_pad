'use strict';

// Sub-path import keeps the client bundle clean. Importing the top-level
// `ep_plugin_helpers` index pulls in every helper's getters; some reach
// server-only modules (eejs, Settings) which esbuild can't resolve for the
// browser.
const {padToggle} = require('ep_plugin_helpers/pad-toggle');

// Same config as the server-side instance — must agree on pluginName,
// settingId, and l10nId for the checkbox ids and clientVars lookup to line up.
const titleToggle = padToggle({
  pluginName: 'ep_set_title_on_pad',
  settingId: 'title',
  l10nId: 'ep_set_title_on_pad.show_title',
  defaultLabel: 'Show Title',
  defaultEnabled: true,
});

// Re-export so the helper sees pad-wide broadcasts and refreshes our state
// when another user toggles the pad-wide checkbox.
exports.handleClientMessage_CLIENT_MESSAGE = titleToggle.handleClientMessage_CLIENT_MESSAGE;

// Existing CUSTOM message handler for the live title-text broadcast (separate
// from the padToggle show/hide checkbox).
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

const applyTitleVisibility = (enabled) => {
  const $padTitle = $('#pad_title');
  if (enabled) {
    $padTitle.removeClass('display_important').addClass('flex_title');
  } else {
    $padTitle.removeClass('flex_title').addClass('display_important');
  }
};

exports.documentReady = () => {
  // padToggle owns the checkbox, cookie, pad-wide broadcast, and enforce
  // logic. onChange fires on initial load and on every subsequent change
  // (user toggle, pad-wide broadcast, enforceSettings).
  titleToggle.init({
    onChange: (enabled) => { applyTitleVisibility(enabled); },
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

  const debouncedSendTitle = debounce(sendTitle);

  $('#input_title').keyup((e) => {
    debouncedSendTitle();
    window.document.title = $('#input_title').val();
    $('#title > h1').text($('#input_title').val());
    if (e.keyCode === 13) {
      $('#save_title').click();
    }
  });
};
