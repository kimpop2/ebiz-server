/*
 * Copyright (c) 2014, COPYRIGHTⓒ2014 eBiz-Pro. ALL RIGHTS RESERVED.
 *
 */
var config = require('../config/config');
var database = require('../db/' + config.dbkind);
var bcrypt = require('bcrypt');

Function.prototype.method = function(name, func){
    this.prototype[name] = func;
};

function User(user){
    this.user = user ? user : {empno: null, password: null};
    this.hashedPassword = null;
}

/**
 * [description]
 *
 *
 */
User.method('save', function(next, cb){
    var user = this.user;
    var hashedPassword = this.hashedPassword;
    
    // Check Same User Exsist already.
    database.simpleExecute(
        ' select empno as "empno", empname as "empname", emppass as "password",  role as "role" ' +
        ' from employee where empno = :empno ',
        { empno   : user.empno.toLowerCase()},
        { outFormat: database.OBJECT }
    )
    .then(function(results) {
        
        // singup user Exist 
        // return exist user (result.rows[0]) via err parameter
        if (results.rows.length > 0) {
            return cb(results.rows[0], null); // user exist error
        }
        // Try to register User
        else{
            /***************************************************************
            * if password NOT encrypt and save then remove this comment block
            * and have to comment below bcrypt.genSalt(
            * **************************************************************/
            database.simpleExecute(
                ' insert into employee ' +
                '          ( empno,  empname,  emppass,   role) ' +
                ' values   (:empno, :empname, :password, :role) ' ,
                {
                    empno   : user.empno,
                    empname : user.empno, // empname : user.empname, 
                    // ?? user.password 에 hash 값을 저장할 수 없음
                    password: user.password, 
                    role: 'user'
                },
                { autoCommit: true }
            )
            .then(function(results){
                // regist user success!!
                // return parameter set err to null, and user to exist user
                return cb(null, {
                    empno   : user.empno,
                    empname : user.empno,
                    password: user.password,
                    role    : 'base'

                });
            })
            .catch(function(err) {
                next(err);
            });
            // commat block to here
            
            /***************************************************************
            * if password must encrypt and save then remove this comment block 
            * and have to comment above database.simpleExecute( block
            * **************************************************************/
            /*
            bcrypt.genSalt(10, function (err, salt) {
                if (err) return next(err);  // getSalt error

                bcrypt.hash(user.password, salt, function (err, hash) {
                    if (err) return next(err); // hash error
                    
                    user.password = hash;
                    
                    database.simpleExecute(
                        ' insert into employee ' +
                        '          ( empno,  empname,  emppass,   role) ' +
                        ' values   (:empno, :empname, :password, :role) ' ,
                        {
                            empno   : user.empno,
                            empname : user.empno, // empname : user.empname, 
                            password: user.password, 
                            role: 'user'
                        },
                        { autoCommit: true }
                    )
                    .then(function(results){
                        // regist user success!!
                        // return parameter set err to null, and user to exist user
                        return cb(null, {
                            empno   : user.empno,
                            empname : user.empno,
                            password: user.password,
                            role    : 'base'

                        });
                    })
                    .catch(function(err) {
                        next(err);
                    });
                });
            });
            // comment block to here
            */
        }
    })
    .catch(function(err) {
        next(err);
    });
});

/**
 * [description]
 *
 *
 */
User.method('findOne', function(next, cb){
    var user = this.user;

    database.simpleExecute(
        ' select empno as "empno", empname as "empname", emppass as "password",  role as "role" ' +
        ' from employee where empno = :empno ',
        { empno   : user.empno},
        { outFormat: database.OBJECT }
    )
    .then(function(results) {
        // User Exist
        console.log(results);

        if (results.rows.length === 1) {
            cb(null, {
                empno: results.rows[0].empno,
                empname: results.rows[0].empname,
                password: results.rows[0].password,
                role: results.rows[0].role
            });
        }
        // Not found User
        else{
            // callback second prameter is user object 
            // set null means user object is null
            return cb(null, null); 
        }
    })
    .catch(function(err) {
        next(err);
    });
});

/**
 * [description]
 *
 *
 */
User.method('comparePassword', function (dbpass, cb) {
    var user = this.user;
    // passw from DB by User.findOne()
    // this.password from req.body.password
    // return callback with boolean isMatch
    /***************************************************************
     * if password was NOT encrypted then remove this comment block 
     * and comment below block
     * *************************************************************/
    if(dbpass !== user.password){
        return cb(new Error());
    }
    cb(null, true);
    // comment to here
    
    /***************************************************************
     * if password was encrypted then remove this comment block 
     * and comment above block
     * *************************************************************/
    /*
    // user.password == login password
    bcrypt.compare(user.password, dbpass, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        console.log('isMatch:' + isMatch);
        cb(null, isMatch);
    });
    // comment to here
    */
   
});

module.exports = User;