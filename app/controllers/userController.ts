import { Router, Request, Response } from 'express';
import * as myDb from '../helpers/db';
import * as auth from '../helpers/auth';
import * as async from 'async';

const router: Router = Router();

router.post('/search', (req: Request, res: Response) => {
    let dat = req.body;

    var sql = `
        select
            user_code as "userCode"
            , user_title as "userTitle"
            , user_first_name as "userFirstName"
            , user_last_name as "userLastName"
            , user_mobile as "userMobile"
            , user_tel as "userTel"
            , user_email as "userEmail"
            , user_pwd as "userPwd"
            , user_active as "userActive"
        from sc_user
        where concat(user_first_name,'-',user_last_name) like '%${dat.searchText}%'
            and user_active like '%${dat.userActive}%';
    `;
    
    myDb.myQuery(sql, (err, rows) => {
        if(!err){
            res.json(rows);
        }
    });
});

router.get('/findByID/:userCode', auth.authenticate(),
    function (req, res) {
        var sql = `
            select
                user_code as "userCode"
                , user_title as "userTitle"
                , user_first_name as "userFirstName"
                , user_last_name as "userLastName"
                , user_mobile as "userMobile"
                , user_tel as "userTel"
                , user_email as "userEmail"
                , user_pwd as "userPwd"
                , user_active as "userActive"
            from sc_user
            where user_code = '${req.params.userCode}';
        `;

        myDb.myQuery(sql, (err, rows) => {
            if(!err){
                res.json(rows);
            }
        });
    }
);

router.post('', auth.authenticate(),
    function (req, res) {
        var userInfo = req.user;
        var dat = req.body;
        var sql = `
            insert into sc_user (
                user_code
                ,user_title
                ,user_first_name
                ,user_last_name
                ,user_mobile
                ,user_tel
                ,user_email
                ,user_pwd
                ,user_active
                ,user_cre
                ,user_cre_dat
                ,user_upd
                ,user_upd_dat
            ) VALUES (
                '${dat.userCode}'
                ,'${dat.userTitle}'
                ,'${dat.userFirstName}'
                ,'${dat.userLastName}'
                ,'${dat.userMobile}'
                ,'${dat.userTel}'
                ,'${dat.userEmail}'
                ,'${dat.userPwd}'
                ,'${dat.userActive}'
                ,'${userInfo.userCode}'
                ,sysdate()
                ,'${userInfo.userCode}'
                ,sysdate()
            );
        `;

        myDb.myQuery(sql, (err, rows) => {
            var ret = {};
            if (err) {
                ret = {
                    status: false,
                    message: err
                };
            } else {
                ret = {
                    status: true,
                    message: 'Complete'
                };
            }
            return res.json(ret);
        });
    }
);

router.put('', auth.authenticate(),
    function (req, res) {
        var userInfo = req.user;
        var dat = req.body;
        var sql = `
            update sc_user SET
                user_title = '${dat.userTitle}'
                ,user_first_name = '${dat.userFirstName}'
                ,user_last_name = '${dat.userLastName}'
                ,user_mobile = '${dat.userMobile}'
                ,user_tel = '${dat.userTel}'
                ,user_email = '${dat.userEmail}'
                ,user_pwd = '${dat.userPwd}'
                ,user_active = '${dat.userActive}'
                ,user_upd = '${userInfo.userCode}'
                ,user_upd_dat = sysdate()
            WHERE user_code = '${dat.userCode}'
        `;

        myDb.myQuery(sql, (err, rows) => {
            var ret = {};
            if (err) {
                ret = {
                    status: false,
                    message: err
                };
            } else {
                ret = {
                    status: true,
                    message: 'Complete'
                };
            }
            return res.json(ret);
        });
    }
);
router.delete('/:userCode', (req: Request, res: Response) => {
    var sql = `
        delete from sc_user
        where user_code = '${req.params.userCode}';
    `;
    myDb.myQuery(sql, (err, rows) => {
        if(err){
            res.end();
        }else{
            res.json(rows);
        }
    });
});

router.post('/updateUserName', (req: Request, res: Response) => {
    let dat = req.body;

    var sql = `
        update sc_user SET
            user_first_name = '${dat.userName}'
        WHERE user_code = '${dat.userCode}'
    `;
    
    myDb.myQuery(sql, (err, rows) => {
        var ret = {};
        if (err) {
            ret = {
                status: false,
                message: err
            };
        } else {
            ret = {
                status: true,
                message: 'Complete'
            };
        }
        return res.json(ret);
    });
});

router.post('/register', function (req, res) {
        var userInfo = req.user;
        var dat = req.body;
        var sql = `
            insert into sc_user (
                user_code
                ,user_first_name
                ,user_last_name
                ,user_pwd
                ,user_active
                ,user_cre
                ,user_cre_dat
                ,user_upd
                ,user_upd_dat
            ) VALUES (
                '${dat.userCode}'
                ,'${dat.userFirstName}'
                ,'${dat.userLastName}'
                ,'${dat.userPwd}'
                ,'Y'
                ,'train'
                ,sysdate()
                ,'train'
                ,sysdate()
            );
        `;

        myDb.myQuery(sql, (err, rows) => {
            var ret = {};
            if (err) {
                ret = {
                    status: false,
                    message: err.sqlMessage
                };
            } else {
                ret = {
                    status: true,
                    message: 'Complete'
                };
            }
            return res.json(ret);
        });
    }
);

export const UserController: Router = router;