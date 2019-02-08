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
  db.createTable('entries', {
    id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
      length: 11
    },
    firstname: {
      type: 'string',
      length: 255,
      notNull: true,
    },
    lastname: {
      type: 'string',
      length: 255,
      defaultValue : null,
    },
    email: {
      type: 'string',
      length: 320,
      notNull: true,
    },
    country: {
      type: 'char',
      length: 2,
      defaultValue : null,
    },
    message: {
      type: 'text',
      notNull : true,
    },
    anon: {
      type: 'int',
      length: 1,
      defaultValue : 0,
    },
    ipv4: {
      type: 'string',
      length: 40,
      defaultValue : null,
    },
    image: {
      type: 'string',
      length: 255,
      defaultValue : null,
    },
    created_at: {
      type: 'string',
      length: 15,
      defaultValue : null,
    },
    updated_at: {
      type: 'string',
      length: 15,
      defaultValue : null,
    },
    confirm_key: {
      type: 'string',
      length: 75,
      defaultValue : null,
    },
    beta: {
      type: 'int',
      length: 1,
      defaultValue : 0,
    },
    newsletter: {
      type: 'int',
      length: 1,
      defaultValue : 0,
    },
    pax: {
      type: 'int',
      length: 1,
      defaultValue : 0,
    },
    email_confirmed: {
      type: 'int',
      length: 1,
      defaultValue : 0,
    },
    status: {
      type: 'int',
      length: 1,
      defaultValue : 0,
    },
  }, function(err) {
    if (err) return callback(err);
    return callback();
  });
};
exports.down = function(db, callback) {
  db.dropTable('entries', callback);
};

exports._meta = {
  "version": 1
};
