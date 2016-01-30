/*
 * Copyright (c) 2014, COPYRIGHTⓒ2014 eBiz-Pro. ALL RIGHTS RESERVED.
 *
 */
var express = require('express');
var config = require('../../config/config');
var database = require('../../db/' + config.dbkind);
var auth = require('../../auth/auth.js');

function getRouter() {
    
    var router = express.Router();

    router.get('/duty-months/:month'    , auth.role('user'), dutyMonths);
    router.get('/dailyduty/:day'        , auth.role('user'), dailyduty);
    router.get('/employee'              , auth.role('user'), employee);
    router.get('/vacation/:year'        , auth.role('user'), vacation);
    router.get('/vacation-detail/:year' , auth.role('user'), vacationDetail);
    router.get('/overtime/:month'       , auth.role('user'), overtime);
    
    return router;
}

module.exports.getRouter = getRouter;

function dutyMonths(req, res, next) {

    database.simpleExecute(
        'select ' +
        '    workdt       as "workdt"       ,' +
        '    week         as "week"         ,' +
        '    worknm       as "worknm"       ,' +
        '    total_time   as "total_time"   ,' +
        '    total2_time  as "total2_time"   ' +
        'from dailyduty ' +
        "where workdt like  :month and empno = :empno ",
        {
            month: req.params.month + '%', 
            empno: req.user.empno
        },
        { outFormat: database.OBJECT }
    )
    .then(function(results) {
        res.json(results.rows);
    })    
    .catch(function(err) {
        next(err);
    });    
    
}

function dailyduty(req, res, next) {

    database.simpleExecute(
        'select ' +
        '    workdt       as "workdt"       ,' +
        '    week         as "week"         ,' +
        '    worknm       as "worknm"       ,' +
        '    start_tm     as "start_tm"     ,' +
        '    end_tm       as "end_tm"       ,' +
        '    out_tm       as "out_tm"       ,' +
        '    in_tm        as "in_tm"        ,' +
        '    iotm         as "iotm"         ,' +
        '    late_time    as "late_time"    ,' +
        '    out_time     as "out_time"     ,' +
        '    nor_time     as "nor_time"     ,' +
        '    ot1_time     as "ot1_time"     ,' +
        '    ot2_time     as "ot2_time"     ,' +
        '    night_time   as "night_time"   ,' +
        '    week1_time   as "week1_time"   ,' +
        '    week2_time   as "week2_time"   ,' +
        '    paid1_time   as "paid1_time"   ,' +
        '    paid2_time   as "paid2_time"   ,' +
        '    total_time   as "total_time"   ,' +
        '    nor_time_s   as "nor_time_s"   ,' +
        '    ot1_time_s   as "ot1_time_s"   ,' +
        '    ot2_time_s   as "ot2_time_s"   ,' +
        '    night_time_s as "night_time_s" ,' +
        '    week1_time_s as "week1_time_s" ,' +
        '    week2_time_s as "week2_time_s" ,' +
        '    paid1_time_s as "paid1_time_s" ,' +
        '    paid2_time_s as "paid2_time_s" ,' +
        '    total2_time  as "total2_time"   ' +
        'from dailyduty ' +
        'where workdt = :day and empno = :empno ',
        {
            day  : req.params.day, 
            empno: req.user.empno
        },
        { outFormat: database.OBJECT }
    )
    .then(function(results) {
        res.json(results.rows[0]);
    })    
    .catch(function(err) {
        next(err);
    });    
    
}

function employee(req, res, next) {

    database.simpleExecute(
        'select ' +
        '    dept_cd      as "dept_cd"       ,' +
        '    dept_nm      as "dept_nm"       ,' +
        '    empno        as "empno"         ,' +
        '    empname      as "empname"       ,' +
        '    class_nm     as "class_nm"      ,' +
        '    enter_dt     as "enter_dt"      ,' +
        '    term_yr      as "term_yr"        ' +
        'from employee ' +
        'where empno = :empno ',
        {
            empno: req.user.empno
        },
        { outFormat: database.OBJECT }
    )
    .then(function(results) {
        res.json(results.rows[0]);
    })    
    .catch(function(err) {
        next(err);
    });    
    
}

function vacation(req, res, next) {

    database.simpleExecute(
        'select ' +
        '    vacation_yr   as "vacation_yr"  ,' +
        '    year_total    as "year_total"   ,' +
        '    year_used     as "year_used"    ,' +
        '    year_remain   as "year_remain"  ,' +
        '    unpaid_total  as "unpaid_total" ,' +
        '    unpaid_used   as "unpaid_used"  ,' +
        '    unpaid_remain as "unpaid_remain" ' +
        'from vacation ' +
        'where vacation_yr = :year and empno = :empno ',
        {
            year : req.params.year, 
            empno: req.user.empno
        },
        { outFormat: database.OBJECT }
    )
    .then(function(results) {
        res.json(results.rows[0]);
    })    
    .catch(function(err) {
        next(err);
    });    
    
}

function vacationDetail(req, res, next) {

    database.simpleExecute(
        'select ' +
        '    vacation_cd as "vacation_cd",' +
        '    used_dt     as "used_dt"    ,' +
        '    reason      as "reason"      ' +
        'from vacationdetail ' +
        "where used_dt like  :year and empno = :empno ",
        {
            year : req.params.year + '%', 
            empno: req.user.empno
        },
        { outFormat: database.OBJECT }
    )
    .then(function(results) {
        res.json(results.rows);
    })    
    .catch(function(err) {
        next(err);
    });    
    
}

function overtime(req, res, next) {

    database.simpleExecute(
        'select ' +
        '    workdt       as "workdt"    ,' +
        '    week         as "week"      ,' +
        '    ot1_time     as "ot1_time"  ,' +
        '    ot2_time     as "ot2_time"  ,' +
        '    week1_time   as "week1_time",' +
        '    week2_time   as "week2_time",' +
        '    early_time   as "early_time" ' +
        'from overtime ' +
        "where workdt like  :month and empno = :empno ",
        {
            month: req.params.month + '%', 
            empno: req.user.empno
        },
        { outFormat: database.OBJECT }
    )
    .then(function(results) {
        res.json(results.rows);
    })    
    .catch(function(err) {
        next(err);
    });    
    
}