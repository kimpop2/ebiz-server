/*
 * Copyright (c) 2014, COPYRIGHTⓒ2014 eBiz-Pro. ALL RIGHTS RESERVED.
 *
 */
module.exports = {
    'secret': 'eBizProIsAwesome',
    'dbkind': 'mysql', // set oracledb or mysql
    'oracledb': {
        user: 'mobp',
        password: 'mobp',
        externalAuth  : false,
        connectString: 'localhost/oracle',
        //connectString: '192.168.10.101/orcl', 
        poolMax: 20,
        poolMin: 2,
        poolIncrement: 2,
        poolTimeout: 10
    },
    'mysql': {
        host :'mysql-mobp.crwkolt83rmk.ap-northeast-2.rds.amazonaws.com',
        port : 3306,
        user : 'mobp',
        password : 'mysqlmobp',
        database:'mobp',
        connectionLimit:20,
        waitForConnections:false
    }
};