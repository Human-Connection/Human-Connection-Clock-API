'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db, callback) {
    db.createTable('apikeys', {
        id: {
            type: 'bigint',
            unsigned: true,
            notNull: true,
            primaryKey: true,
            autoIncrement: true,
            length: 64
        },
        secret: {
            type: 'string',
            length: 64,
            unique: true,
            notNull: true,
        },
        valid: {
            type: 'smallint',
            length: 1,
            unsigned: true,
            notNull: true,
            defaultValue: '0'
        },
        expire_at: {
            type: 'bigint',
            length: 64,
            notNull: true,
        },
        created_at: {
            type: 'bigint',
            length: 64,
            unsigned: true,
            notNull: true,
        },
        updated_at: {
            type: 'bigint',
            length: 64,
            unsigned: true,
            notNull: true,
        },
    }, function (err) {
        if (err) return callback(err);
        return callback();
    });
};
exports.down = function (db, callback) {
    db.dropTable('apikeys', callback);
};

exports._meta = {
    'version': 1
};
