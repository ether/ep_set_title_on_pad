'use strict';

const eejs = require('ep_etherpad-lite/node/eejs/');

exports.eejsBlock_body = (hookName, args, cb) => {
  const templateFile = 'ep_set_title_on_pad/templates/title.ejs';
  args.content = eejs.require(templateFile, {settings: false}) + args.content;
  return cb();
};
