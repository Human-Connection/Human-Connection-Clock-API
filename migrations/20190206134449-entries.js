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
    db.createTable('entries', {
        id: {
            type: 'bigint',
            unsigned: true,
            notNull: true,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            length: 20
        },
        email: {
            type: 'string',
            length: 255,
            notNull: true,
        },
        firstname: {
            type: 'string',
            length: 255,
            notNull: true,
        },
        lastname: {
            type: 'string',
            length: 255,
            defaultValue: null,
        },
        message: {
            type: 'text',
            notNull: true,
        },
        country: {
            type: 'string',
            length: 4,
            defaultValue: null,
        },
        image: {
            type: 'string',
            length: 255,
            notNull: true,
        },
        ipv4: {
            type: 'string',
            length: 30,
            defaultValue: null,
        },
        ipv6: {
            type: 'string',
            length: 60,
            defaultValue: null,
        },
        email_confirmed: {
            type: 'smallint',
            length: 1,
            unsigned: true,
            notNull: true,
            defaultValue: '0',
        },
        confirm_key: {
            type: 'string',
            length: 255,
            defaultValue: null,
        },
        status: {
            type: 'smallint',
            length: 1,
            unsigned: true,
            notNull: true,
            defaultValue: '0',
        },
        anon: {
            type: 'smallint',
            length: 1,
            unsigned: true,
            notNull: true,
            defaultValue: '0',
        },
        created_at: {
            type: 'bigint',
            length: 20,
            unsigned: true,
            defaultValue: null,
        },
        updated_at: {
            type: 'bigint',
            length: 20,
            unsigned: true,
            defaultValue: null,
        },
        confirmed_at: {
            type: 'bigint',
            length: 20,
            unsigned: true,
            defaultValue: null,
        },
        beta: {
            type: 'smallint',
            length: 1,
            notNull: true,
            defaultValue: '0',
        },
        newsletter: {
            type: 'smallint',
            length: 1,
            notNull: true,
            defaultValue: '0',
        },
        pax: {
            type: 'smallint',
            length: 1,
            notNull: true,
            defaultValue: '0',
        },
    }, function (err) {
        if (err) return callback(err);
        return callback();
    });
};
exports.down = function (db, callback) {
    db.dropTable('entries', callback);
};

exports._meta = {
    'version': 1
};
