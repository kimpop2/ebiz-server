/*
 * Copyright (c) 2014, COPYRIGHTⓒ2014 eBiz-Pro. ALL RIGHTS RESERVED.
 *
 */
var express  = require('express');
var config   = require('../../config/config');
var database = require('../../db/' + config.dbkind);
var auth     = require('../../auth/auth.js');

function getRouter() {
    
    var router = express.Router();

    router.get('/salary_chart/:month',      auth.role('user'), salary);
    router.get('/bonus_chart/:month',       auth.role('user'), bonus);
    router.get('/monthlyduty_chart/:month', auth.role('user'), monthlyDuty);

    return router;
}

module.exports.getRouter = getRouter;

function salary(req, res, next) {

    database.simpleExecute(
        'select ' +
        '    empno                 as "empno"                 ,' +
        '    empname               as "empname"               ,' +
        '    pay_month             as "pay_month"             ,' +
        '    total_income          as "total_income"          ,' +
        '    total_deduct          as "total_deduct"          ,' +
        '    net_income            as "net_income"            ,' +
        '    pay_base              as "pay_base"              ,' +
        '    allow_ot1_time        as "allow_ot1_time"        ,' +
        '    allow_ot2_time        as "allow_ot2_time"        ,' +
        '    allow_paid1_time      as "allow_paid1_time"      ,' +
        '    allow_night_time      as "allow_night_time"      ,' +
        '    allow_paid2_time      as "allow_paid2_time"      ,' +
        '    allow_week1_time      as "allow_week1_time"      ,' +
        '    allow_week2_time      as "allow_week2_time"      ,' +
        '    last_balance_income   as "last_balance_income"   ,' +
        '    user_defined_income   as "user_defined_income"   ,' +
        '    tax_income            as "tax_income"            ,' +
        '    tax_residence         as "tax_residence"         ,' +
        '    nation_pension        as "nation_pension"        ,' +
        '    fee_medical_insurance as "fee_medical_insurance" ,' +
        '    fee_hire_insurance    as "fee_hire_insurance"    ,' +
        '    fee_meail             as "fee_meail"             ,' +
        '    fee_informal_group    as "fee_informal_group"    ,' +
        '    fee_mutual_aid        as "fee_mutual_aid"        ,' +
        '    fee_union             as "fee_union"             ,' +
        '    user_defined_deduct   as "user_defined_deduct"    ' +
        'from salary ' +
        'where pay_month = :month and empno = :empno ',
        {
            month: 'substr(' + req.params.month + ', 1, 4)' + '%', 
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

function bonus(req, res, next) {

    database.simpleExecute(
        'select ' +
        '    empno        as "empno"        ,' +
        '    empname      as "empname"      ,' +
        '    bonus_month  as "bonus_month"  ,' +
        '    bonus_name   as "bonus_name"   ,' +
        '    bonus_amount as "bonus_amount"  ' +
        'from bonus ' +
        'where bonus_month = :month and empno = :empno',
        {
            month: req.params.month
           ,empno: req.user.empno
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

function monthlyDuty(req, res, next) {

    database.simpleExecute(
        'select ' +
        '    bizcd               as "bizcd"               ' +
        '   ,pay_month           as "pay_month"           ' +
        '   ,dept_cd             as "dept_cd"             ' +
        '   ,empno               as "empno"               ' +
        '   ,empname             as "empname"             ' +
        '   ,class_nm            as "class_nm"            ' +
        '   ,dept_nm             as "dept_nm"             ' +
        '   ,pay_version_id      as "pay_version_id"      ' +
        '   ,time_nor_time       as "time_nor_time"       ' +
        '   ,time_ot1_time       as "time_ot1_time"       ' +
        '   ,time_ot2_time       as "time_ot2_time"       ' +
        '   ,time_night_time     as "time_night_time"     ' +
        '   ,time_week1_time     as "time_week1_time"     ' +
        '   ,time_week2_time     as "time_week2_time"     ' +
        '   ,time_paid1_time     as "time_paid1_time"     ' +
        '   ,time_paid2_time     as "time_paid2_time"     ' +
        '   ,time_allowed_time   as "time_allowed_time"   ' +
        '   ,time_nor_time   +                            ' +
        '    time_ot1_time   +                            ' +
        '    time_ot2_time   +                            ' +
        '    time_night_time +                            ' +
        '    time_week1_time +                            ' +
        '    time_week2_time +                            ' +
        '    time_paid1_time +                            ' +
        '    time_paid2_time +                            ' +
        '    time_allowed_time   as "total_time"          ' +
        'from monthlyduty ' +
        'where pay_month = :month and empno = :empno ',
        {
            month: 'substr(' + req.params.month + ', 1, 4)' + '%', 
            empno: req.user.empno
        },
        { outFormat: database.OBJECT//, maxRows: 4000
         }
    )
    .then(function(results) {

        res.json(results.rows);
    })    
    .catch(function(err) {
        next(err);
    });
}
