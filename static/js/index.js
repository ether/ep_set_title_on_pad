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

// Centralised so the three call sites that swap the loading text for a real
// title can't drift apart on a11y cleanup. html10n auto-populates aria-label
// (etherpad PR #7584) when it translates a data-l10n-id node; if we leave
// those attributes behind, screen readers keep announcing the stale value
// (e.g. "Loading..." or the previous title). See ether/etherpad#7255.
const applyLiveTitle = (text) => {
  const titleTag = $('#title > h1 > a');
  titleTag.text(text);
  titleTag.removeAttr('data-l10n-id');
  // Defensive: html10n now places its auto-aria-label on the inner <span>
  // that holds data-l10n-id, but .text() above replaces all children with a
  // single text node, so neither the span nor any stale attributes survive
  // — still clean these in case an older template version is in play.
  titleTag.removeAttr('aria-label');
  titleTag.removeAttr('data-l10n-aria-label');
};

// Existing CUSTOM message handler for the live title-text broadcast (separate
// from the padToggle show/hide checkbox).
exports.handleClientMessage_CUSTOM = (hook, context, cb) => {
  if (context.payload.action === 'recieveTitleMessage') {
    const message = context.payload.message;
    const padTitleElement = $('#input_title');
    if (!padTitleElement.is(':visible')) { // if we're not editing..
      if (message) {
        window.document.title = message;
        applyLiveTitle(message);
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
    applyLiveTitle(clientVars.padId);
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
    applyLiveTitle($('#input_title').val());
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
