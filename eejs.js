const eejs = require('ep_etherpad-lite/node/eejs/');

exports.eejsBlock_styles = function (hook_name, args, cb) {
  return cb();
};

exports.eejsBlock_body = function (hook_name, args, cb) {
  args.content = eejs.require('ep_set_title_on_pad/templates/title.ejs', {settings: false}) + args.content;
};
