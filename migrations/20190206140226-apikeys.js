'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('apikeys', {
    secret: {
      type: 'string',
      length: 100,
      unique: true,
      notNull: true,
    },
    valid: {
      type: 'int',
      length: 1,
      default: 0
    },
  }, function(err) {
    if (err) return callback(err);
    return callback();
  });
};
exports.down = function(db, callback) {
  db.dropTable('apikeys', callback);
};

exports._meta = {
  "version": 1
};
