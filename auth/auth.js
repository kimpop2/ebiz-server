/*
 * Copyright (c) 2014, COPYRIGHTⓒ2014 eBiz-Pro. ALL RIGHTS RESERVED.
 *
 */
var express = require('express');
var config = require('../config/config');
var app = express();
// -------------------------------------------------------------------
// Authorification is depended on dbkind
// -------------------------------------------------------------------
var passport = require('passport');
var jwt = require('jwt-simple');

var User = require('../models/user'); // get the User model

function role(grant) {
    
    return function(req, res, next) {
        
        var token;
        var payload;
        // 인증헤더가 없는 요청은 권한 없음 메시지 응답
        if (!req.headers.authorization) {
            return res.status(403).json({
                success: false,
                msg: '인증되지 않은 요청입니다.'
           });
        }
        // remove prefix and get the token
        token = req.headers.authorization.split(' ')[1];

        
        try {
            payload = jwt.decode(token, config.secret);
            console.log(payload);
        } catch (e) {
            console.log(e);
            // Authentication Expired
            if (e.name === 'TokenExpiredError') {
                return res.status(403).json({
                    success: false,
                    msg: '인증기간이 만료되었습니다.'
               });
            }
            // Fail to Authentication
            else {
                return res.status(403).json({
                    success: false,
                    msg: '인증에 실패했습니다.'
               });
            }
        }

        // User Role check
        // Note: No role means public then pass
        if (!grant || grant === payload.role) {
        console.log("role pass:" + grant);    
            req.user = {
                empno: payload.empno,
                empname: payload.empname,
                role: payload.role
            };

            next();
        } else {
        console.log("role error:" + grant);    
            return res.status(401).json({
                success: false,
                msg: '사용권한이 없습니다.'
           });
        }
        
    }
    
}

module.exports.role = role;

function getRouter() {
    
    // Use the passport package in our application
    app.use(passport.initialize());
    // pass passport for configuration
    require('../config/passport')(passport);
   
    var router = express.Router();

    // create a new user account
    router.route('/signup').post(signup);

    // route to authenticate a user
    router.route('/login').post(login);

    // route to a restricted info
    //router.route('/userinfo').get(userinfo);
    router.route('/userinfo').get(userinfo);
    
    return router;
}

module.exports.getRouter = getRouter;

// create a new user account
function signup(req, res, next) {
    if (!req.body.empno || !req.body.password) {
        res.json({
            success: false,
            msg: '아이디와 비밀번호를 입력하십시오.'
        });
    } else {
        var newUser = new User({
            empno: req.body.empno,
            password: req.body.password
        });
        // save the user
        newUser.save(next, function(err, user) {
        console.log('exist user:' + err);
        console.log('new user:' + user);
            if (err) {
                res.json({
                    success: false,
                    msg: '동일한 아이디로 사용자가 존재합니다.',
                    user: err
                });
            }
            else{
                res.json({
                    success: true,
                    msg: '축하합니다. 사용자가 생성되었습니다.',
                    user: user
                });
            }
        });
    }
}

// route to authenticate a user
function login(req, res, next) {
    var loginUser = new User({
        empno: req.body.empno,
        password: req.body.password
    });

    if (!req.body.empno || !req.body.password) {
        res.json({
            success: false,
            msg: '아이디와 비밀번호를 입력하십시오.'
        });
    } else {
        loginUser.findOne( next, function(err, user) {
            if (err) return next(err);

            if (!user) {
                res.json({
                    success: false,
                    msg: '로그인 실패. 사용자가 없습니다.'
                });
            } else {
                // check if password matches
                // user.password was got from DB by User.findOne()
                loginUser.comparePassword(user.password, function(err, isMatch) {
                    if (isMatch && !err) {
                        // if user is found and password is right create a token
                        // user contains empno, empname, role
                        var token = jwt.encode(user, config.secret);
                        // return the information including token as JSON
                        res.json({
                            success: true,
                            token: 'JWT ' + token
                        });
                    } else {
                        res.json({
                            success: false,
                            msg: '로그인 실패. 비밀번호가 틀립니다.'
                        });
                    }
                });
            }
        });
    }
}

// route to a restricted info
function userinfo(req, res, next) {
console.log('userinfo');
    passport.authenticate('jwt', {session: false});
    
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        var jwtUser = new User({
            empno: decoded.empno
        });

        jwtUser.findOne(next, function(err, user) {
            if (err) return next(err);

            if (!user) {
                res.status(403).send({
                    success: false,
                    msg: '사용자 확인 실패. 사용자가 없습니다.'
                });
            } else {
            console.log('userinfo:' + user);
                res.json({
                    success: true,
                    msg: user 
                });
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            msg: '인증되지 않았거나 사용기간이 만료되었습니다.'
        });
    }
}

function getToken(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};
