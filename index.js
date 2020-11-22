const settings = require('ep_etherpad-lite/node/utils/Settings');
const db = require('ep_etherpad-lite/node/db/DB').db;

// Remove cache for this procedure
db.dbSettings.cache = 0;

exports.exportFileName = function (hook, padId, callback) {
  let title = padId;
  // Sets Export File Name to the same as the title
  db.get(`title:${padId}`, (err, value) => {
    console.log('Found ', value, ' for ', padId);
    if (value) title = value;
  });
  callback(title);
};
