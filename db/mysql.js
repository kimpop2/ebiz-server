/*
 * Copyright (c) 2014, COPYRIGHTⓒ2014 eBiz-Pro. ALL RIGHTS RESERVED.
 *
 */
var mysql = require('mysql');
var Promise = require('es6-promise').Promise;
var async = require('async');
var pool;
var buildupScripts = [];
var teardownScripts = [];

//Query result outFormat option constants
module.exports.ARRAY    = null; //mysql.ARRAY;
module.exports.OBJECT   = null; //mysql.OBJECT;

//Constants for bind parameter type properties
module.exports.STRING   = mysql.STRING;
module.exports.NUMBER   = mysql.INT;
module.exports.DATE     = mysql.DATE;

//Constants for bind parameter dir properties
module.exports.BIND_IN      = null;//mysql.BIND_IN;
module.exports.BIND_OUT     = null;//mysql.BIND_OUT;
module.exports.BIND_INOUT   = null;//mysql.BIND_INOUT;

function createPool(config) {
    return new Promise(function(resolve, reject) {
        pool = mysql.createPool(config);
        if(!pool){
            reject(null);
        }
        else{
            resolve(pool);
        }
    });
}

module.exports.createPool = createPool;

function terminatePool() {
    return new Promise(function(resolve, reject) {
        if (pool) {
            pool.end(function(err) {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        } else {
            resolve();
        }
    });
}

module.exports.terminatePool = terminatePool;

function getPool() {
    return pool;
}

module.exports.getPool = getPool;

function addBuildupSql(statement) {
    var stmt = {
        sql: statement.sql,
        binds: statement.binds || {},
        options: statement.options || {}
    };

    buildupScripts.push(stmt);
}

module.exports.addBuildupSql = addBuildupSql;

function addTeardownSql(statement) {
    var stmt = {
        sql: statement.sql,
        binds: statement.binds || {},
        options: statement.options || {}
    };

    teardownScripts.push(stmt);
}

module.exports.addTeardownSql = addTeardownSql;


function getConnection() {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                return reject(err);
            }

            // sql parmeter is :param type that covert to fit mysql
            connection.config.queryFormat = function(query, values) {
                if (!values) return query;
                return query.replace(/\:(\w+)/g, function(txt, key) {
                    if (values.hasOwnProperty(key)) {
                        return this.escape(values[key]);
                    }
                    return txt;
                }.bind(this));
            };

            resolve(connection);
            
            /* below commant because can not excute in mysql
            async.eachSeries(
                buildupScripts,
                function(statement, callback) {
                    connection.query(statement.sql, statement.binds, statement.options, function(err) {
                        callback(err);
                    });
                },
                function(err) {
                    if (err) {
                        return reject(err);
                    }

                    resolve(connection);
                }
            );
            */
        });
    });
}

module.exports.getConnection = getConnection;

function execute(sql, bindParams, options, connection) {
    return new Promise(function(resolve, reject) {
        /////////////////////connection.query(sql, bindParams, options, function(err, results) {
        // remove options parameter
        connection.query(sql, bindParams, function(err, results) {
            if (err) {
                return reject(err);
            }
            var object = { rows: results };

            resolve(object);
        });
    });
}

module.exports.execute = execute;

function releaseConnection(connection) {
    async.eachSeries(
        teardownScripts,
        function(statement, callback) {
            connection.query(statement.sql, statement.binds, statement.options, function(err) {
                callback(err);
            });
        },
        function(err) {
            if (err) {
                console.error(err); //don't return as we still need to release the connection
            }

            connection.release(function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
    );
}

module.exports.releaseConnection = releaseConnection;

function simpleExecute(sql, bindParams, options) {
    if (options.autoCommit === undefined) {//isAutoCommit was renamed to autoCommit in node-mysql v0.5.0
        options.autoCommit = true;
    }

    if (options.isAutoCommit === undefined) {//isAutoCommit was left for backward compatibility, should probably remove in future
        options.isAutoCommit = true;
    }

    return new Promise(function(resolve, reject) {
        getConnection()
            .then(function(connection) {
                execute(sql, bindParams, options, connection)
                    .then(function(results) {
                        resolve(results);

                        process.nextTick(function() {
                            releaseConnection(connection);
                        });
                    })
                    .catch(function(err) {
                        reject(err);

                        process.nextTick(function() {
                            releaseConnection(connection);
                        });
                    });
            })
            .catch(function(err) {
                reject(err);
            });
    });
}

module.exports.simpleExecute = simpleExecute;