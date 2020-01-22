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
    db.removeColumn(
        'entries',
        'ipv4',
        function (err) {
            if (err) return callback(err);
            return callback();
        });
    db.removeColumn(
        'entries',
        'ipv6',
        function (err) {
            if (err) return callback(err);
            return callback();
        });
};

exports.down = function (db, callback) {
    db.addColumn(
        'entries',
        'ipv4',
        {
            type: 'string',
            length: 30,
            defaultValue: null,
        },
        function (err) {
            if (err) return callback(err);
            return callback();
        });
    db.addColumn(
        'entries',
        'ipv6',
        {
            type: 'string',
            length: 60,
            defaultValue: null,
        },
        function (err) {
            if (err) return callback(err);
            return callback();
        });
};

exports._meta = {
    'version': 1
};
