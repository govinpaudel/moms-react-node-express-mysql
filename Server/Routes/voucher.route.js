const express = require('express')
const connection = require('../Libraries/connection')
const router = express.Router();
const date = require('date-and-time')
router.get('/', (req, res, next) => { res.send("Hello from voucher Route page") })

router.post('/Monthlist', (req, res) => {
    let user = req.body;
    let query = "select DISTINCT a.month_id as mid,b.month_name as mname,b.month_order from voucher a\
    inner join voucher_month b on a.month_id=b.id\
    where a.office_id=? and aaba_id=?\
    order by b.month_order";
    connection.query(query, [user.office_id, user.aaba_id], (err, months) => {
        if (err) { return; }
        return res.status(200).json({
            message: "डाटा सफलतापुर्वक प्राप्त भयो",
            months: months
        })
    })
})
router.post('/Fantlist', (req, res) => {
    let user = req.body;
    let query = "select DISTINCT a.fant_id as fid,b.fant_name as fname,b.display_order from voucher a\
    inner join voucher_fant b on a.fant_id=b.id\
    where a.office_id=? and aaba_id=?\
    order by b.display_order"
    connection.query(query, [user.office_id, user.aaba_id], (err, fants) => {
        if (err) { return; }
        return res.status(200).json({
            message: "डाटा सफलतापुर्वक प्राप्त भयो",
            fants: fants
        })
    })
});
router.post('/Userlist', (req, res) => {
    let user = req.body;
    let query = "select DISTINCT a.created_by_user_id as uid,b.nepname as uname from voucher a\
    inner join users b on a.created_by_user_id=b.id\
    where a.office_id=? and aaba_id=? order by uid"
    connection.query(query, [user.office_id, user.aaba_id], (err, users) => {
        if (err) { return; }
        return res.status(200).json({
            message: "डाटा सफलतापुर्वक प्राप्त भयो",
            users: users
        })
    })
});
router.post('/VoucherMonthly', (req, res) => {
    let user = req.body;
    console.log(user);
    let keys = user.month_id
    let months = keys.map((it) => { return `'${it}'` })
    console.log(months);
    let query1 = `select a.aaba_id,a.office_id,a.sirshak_id,b.sirshak_name,c.acc_sirshak_name,sum(amount) amount from voucher a\
    inner join voucher_sirshak b on a.sirshak_id = b.id\
    inner join voucher_acc_sirshak c on b.acc_sirshak_id=c.id\
    where aaba_id=${user.aaba_id} and office_id=${user.office_id} and month_id in (${months}) and sirshak_id=2\
    group by aaba_id,office_id,sirshak_id`;
    let query2 = `select a.aaba_id,a.office_id,sum(a.amount) as amount,sum(a.amount*(e.sangh)/100) as sangh,sum(a.amount*(e.sanchitkosh)/100) as sanchitkosh,sum(a.amount*(e.pardesh)/100) as pardesh,sum(a.amount*(e.isthaniye)/100) as isthaniye from voucher a
    inner join voucher_sirshak b on a.sirshak_id = b.id
    inner join voucher_acc_sirshak c on c.id=b.acc_sirshak_id
    inner join offices d on a.office_id=d.id
    inner join voucher_badhfadh e on e.aaba_id=a.aaba_id and e.acc_sirshak_id=c.id and e.state_id=d.state_id
    where a.aaba_id=${user.aaba_id} and a.office_id=${user.office_id} and a.month_id in (${months})
    group by a.aaba_id,a.office_id`;
    let query3 = `select a.aaba_id,a.office_id,a.sirshak_id,b.sirshak_name,f.acc_sirshak_name,a.napa_id,e.napa_name,sum(a.amount) as amount,sum(a.amount*(d.sanchitkosh)/100) as sanchitkosh,sum(a.amount*(d.pardesh)/100) as pardesh,sum(a.amount*(d.isthaniye)/100) as isthaniye from voucher a\
    inner join voucher_sirshak b on a.sirshak_id = b.id\
    inner join voucher_acc_sirshak f on f.id=b.acc_sirshak_id\
    inner join offices c on a.office_id=c.id\
    inner join voucher_badhfadh d on a.aaba_id=d.aaba_id and f.id=d.acc_sirshak_id and c.state_id=d.state_id\
    inner join voucher_napa e on a.napa_id=e.id and a.office_id=e.office_id\
    where a.aaba_id=${user.aaba_id} and a.office_id=${user.office_id} and a.month_id in(${months}) and a.sirshak_id=2
    group by a.aaba_id,a.office_id,a.sirshak_id,b.sirshak_name,f.acc_sirshak_name,a.napa_id,e.napa_name     order by a.napa_id,e.napa_name`;
    let query4 = `select a.aaba_id,a.office_id,f.id,f.acc_sirshak_name,sum(a.amount) as amount,sum(a.amount*(d.sanchitkosh)/100) as sanchitkosh,sum(a.amount*(d.pardesh)/100) as pardesh,sum(a.amount*(d.isthaniye)/100) as isthaniye,sum(a.amount*(d.sangh)/100) as sangh from voucher a\
    inner join voucher_sirshak b on a.sirshak_id=b.id\
    inner join voucher_acc_sirshak f on f.id=b.acc_sirshak_id\
    inner join offices c on c.id=a.office_id\
    inner join voucher_badhfadh d on a.aaba_id=d.aaba_id and f.id=d.acc_sirshak_id and c.state_id=d.state_id\
    where a.aaba_id=${user.aaba_id} and a.office_id=${user.office_id} and a.month_id in (${months}) and a.sirshak_id!=1    
    group by a.aaba_id,a.office_id,f.id,f.acc_sirshak_name\
    order by f.display_order`;
    console.log('query1', query1);
    connection.query(query1, (err, registration) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('result1', registration);
        console.log('query2', query2);
        connection.query(query2, (err, summary) => {
            if (err) {
                return;
                console.log(err);
            }
            console.log('result2', summary);
            console.log('query3', query3);
            connection.query(query3, (err, isthaniye) => {
                if (err) {
                    return;
                    console.log(err);
                }
                console.log('result3', isthaniye)
                console.log('query4', query4);
                connection.query(query4, (err, pardesh) => {
                    if (err) {
                        return;
                        console.log(err);
                    }
                    console.log('result4', pardesh);
                    return res.status(200).json({
                        message: "डाटा सफलतापुर्वक प्राप्त भयो", data: {
                            registration: registration,
                            summary: summary,
                            isthaniye: isthaniye,
                            pardesh: pardesh
                        }
                    })
                })
            })
        })
    })

})
router.post('/VoucherByDate', (req, res) => {
    let user = req.body;
    console.log(user);
    let keys = user.fant_id
    let fants = keys.map((it) => { return `'${it}'` })
    console.log(fants);
    console.log(fants.length);
    if (fants.length == 0) {
        let query = "select a.id,a.edate_voucher,a.ndate_voucher,a.edate_transaction,a.ndate_transaction,a.sirshak_id,b.sirshak_name,a.fant_id,c.fant_name,a.napa_id,d.napa_name,a.voucherno,a.amount,a.created_by_user_id,a.deposited_by from voucher a\
    inner join voucher_sirshak b on a.sirshak_id=b.id\
    inner join voucher_fant c on a.fant_id=c.id\
    inner join voucher_napa d on a.napa_id=d.id and a.office_id=d.office_id\
    where a.office_id=? and  a.edate_transaction >=? and a.edate_transaction<=?\
    order by edate_transaction,ndate_transaction,voucherno";
        connection.query(query, [user.office_id, user.start_date, user.end_date], (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.status(200).json({ message: "डाटा सफलतापुर्वक प्राप्त भयो", data: data });
        }
        )

    }
    else {
        let query = `select a.id,a.ndate_voucher,a.ndate_transaction,a.sirshak_id,b.sirshak_name,a.fant_id,c.fant_name,a.napa_id,d.napa_name,a.voucherno,a.amount,a.created_by_user_id,a.deposited_by from voucher a\
        inner join voucher_sirshak b on a.sirshak_id=b.id\
        inner join voucher_fant c on a.fant_id=c.id\
        inner join voucher_napa d on a.napa_id=d.id and a.office_id=d.office_id\        
        where a.office_id=? and a.fant_id in (${fants}) and  a.edate_transaction >=? and a.edate_transaction<=?\
        order by edate_transaction,ndate_transaction,voucherno`;
        connection.query(query, [user.office_id, user.start_date, user.end_date], (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.status(200).json({ message: "डाटा सफलतापुर्वक प्राप्त भयो", data: data });
        }
        )
    }
})
router.post('/VoucherSumByDate', (req, res) => {
    let user = req.body;
    console.log(user);
    let keys = user.fant_id
    let fants = keys.map((it) => { return `'${it}'` })
    console.log(fants);
    console.log(fants.length);
    if (fants.length == 0) {
        console.log("no fant selected");
        let query = "(select a.edate_transaction,a.ndate_transaction,a.sirshak_id,b.sirshak_name,c.acc_sirshak_name,sum(a.amount) as amount from voucher a\
    inner join voucher_sirshak b on a.sirshak_id=b.id\
    inner join voucher_acc_sirshak c on b.acc_sirshak_id=c.id\
    where a.office_id=? and  a.edate_transaction >=? and a.edate_transaction<=?\
    group by a.edate_transaction,a.ndate_transaction,a.sirshak_id,b.sirshak_name)\
    UNION ALL\
    (select a.edate_transaction,a.ndate_transaction,99 as sirshak_id,CONCAT(a.ndate_transaction,' को जम्मा') as sirshak_name,'' as acc_sirshak_name,sum(a.amount) as amount from voucher a\
    inner join voucher_sirshak b on a.sirshak_id=b.id\
    inner join voucher_acc_sirshak c on b.acc_sirshak_id=c.id\
    where a.office_id=? and  a.edate_transaction >=? and a.edate_transaction<=?\
    group by a.edate_transaction,a.ndate_transaction)\
    order by edate_transaction";
        connection.query(query, [user.office_id, user.start_date, user.end_date, user.office_id, user.start_date, user.end_date], (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.status(200).json({ message: "डाटा सफलतापुर्वक प्राप्त भयो", data: data });
        }
        )

    }
    else {
        console.log("fants selected");
        let query = `(select a.edate_transaction,a.ndate_transaction,a.sirshak_id,b.sirshak_name,c.acc_sirshak_name,sum(a.amount) as amount from voucher a\
        inner join voucher_sirshak b on a.sirshak_id=b.id\
        inner join voucher_acc_sirshak c on c.id=b.acc_sirshak_id\
        where a.fant_id in (${fants}) and a.office_id=? and  a.edate_transaction >=? and a.edate_transaction<=?\
        group by a.edate_transaction,a.edate_transaction,a.ndate_transaction,a.sirshak_id,b.sirshak_name,c.acc_sirshak_name)\
        UNION ALL\
        (select a.edate_transaction,a.ndate_transaction,99 as sirshak_id,CONCAT(a.ndate_transaction,' को जम्मा') as sirshak_name,'' as acc_sirshak_name,sum(a.amount) as amount from voucher a\
        inner join voucher_sirshak b on a.sirshak_id=b.id\
        where a.fant_id in (${fants}) and a.office_id=? and  a.edate_transaction >=? and a.edate_transaction<=?\
        group by a.edate_transaction,a.ndate_transaction)\
        order by edate_transaction`;
        connection.query(query, [user.office_id, user.start_date, user.end_date, user.office_id, user.start_date, user.end_date], (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.status(200).json({ message: "डाटा सफलतापुर्वक प्राप्त भयो", data: data });
        }
        )
    }
})
router.post('/VoucherSumByDateUser', (req, res) => {
    let user = req.body;
    console.log(user);
    let keys = user.user_id
    let users = keys.map((it) => { return `'${it}'` })
    console.log(users);
    console.log(users.length);
    if (users.length == 0) {
    console.log("no user selected");
    let query = "(select a.edate_transaction,a.ndate_transaction,a.created_by_user_id,d.nepname,a.sirshak_id,b.sirshak_name,c.acc_sirshak_name,sum(a.amount) as amount from voucher a\
    inner join voucher_sirshak b on a.sirshak_id=b.id\
    inner join voucher_acc_sirshak c on b.acc_sirshak_id=c.id\
	inner join users d on a.created_by_user_id=d.id\
    where a.office_id=? and  a.edate_transaction >=? and a.edate_transaction<=?\
    group by a.edate_transaction,a.ndate_transaction,a.created_by_user_id,a.sirshak_id,b.sirshak_name)\
    UNION ALL\
    (select a.edate_transaction,a.ndate_transaction,a.created_by_user_id,d.nepname,99 as sirshak_id,CONCAT(a.ndate_transaction,' ',d.nepname,'  को जम्मा') as sirshak_name,'' as acc_sirshak_name,sum(a.amount) as amount from voucher a\
    inner join voucher_sirshak b on a.sirshak_id=b.id\
    inner join voucher_acc_sirshak c on b.acc_sirshak_id=c.id\
	inner join users d on a.created_by_user_id=d.id\
    where a.office_id=? and  a.edate_transaction >=? and a.edate_transaction<=?\
    group by a.edate_transaction,a.ndate_transaction,a.created_by_user_id)\
    order by edate_transaction,created_by_user_id";
        connection.query(query, [user.office_id, user.start_date, user.end_date, user.office_id, user.start_date, user.end_date], (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.status(200).json({ message: "डाटा सफलतापुर्वक प्राप्त भयो", data: data });
        }
        )

    }
    else {
        console.log("users selected");
        let query = `(select a.edate_transaction,a.ndate_transaction,a.created_by_user_id,d.nepname,a.sirshak_id,b.sirshak_name,c.acc_sirshak_name,sum(a.amount) as amount from voucher a\
    inner join voucher_sirshak b on a.sirshak_id=b.id\
    inner join voucher_acc_sirshak c on b.acc_sirshak_id=c.id\
	inner join users d on a.created_by_user_id=d.id\
    where a.created_by_user_id in (${users}) and a.office_id=? and  a.edate_transaction >=? and a.edate_transaction<=?\
    group by a.edate_transaction,a.ndate_transaction,a.created_by_user_id,a.sirshak_id,b.sirshak_name)\
    UNION ALL\
    (select a.edate_transaction,a.ndate_transaction,a.created_by_user_id,d.nepname,99 as sirshak_id,CONCAT(a.ndate_transaction,' ',d.nepname,'  को जम्मा') as sirshak_name,'' as acc_sirshak_name,sum(a.amount) as amount from voucher a\
    inner join voucher_sirshak b on a.sirshak_id=b.id\
    inner join voucher_acc_sirshak c on b.acc_sirshak_id=c.id\
	inner join users d on a.created_by_user_id=d.id\
    where  a.created_by_user_id in (${users}) and a.office_id=? and  a.edate_transaction >=? and a.edate_transaction<=?\
    group by a.edate_transaction,a.ndate_transaction,a.created_by_user_id)\
    order by edate_transaction,created_by_user_id`;
        connection.query(query, [user.office_id, user.start_date, user.end_date, user.office_id, user.start_date, user.end_date], (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.status(200).json({ message: "डाटा सफलतापुर्वक प्राप्त भयो", data: data });
        }
        )
    }
})
router.post('/VoucherFant', (req, res) => {
    let user = req.body;
    console.log(user);
    let montharray = user.month_id
    let months = montharray.map((it) => { return `'${it}'` })
    console.log(months);
    let fantarray = user.fant_id
    let fants = fantarray.map((it) => { return `'${it}'` })
    console.log(fants);
    let query1 = `select a.aaba_id,a.office_id,a.month_id,d.month_name,d.month_order,a.fant_id,c.fant_name,a.sirshak_id,b.sirshak_name,e.acc_sirshak_name,b.display_order,sum(a.amount)as amount from voucher a \
                inner join voucher_sirshak b on a.sirshak_id=b.id\                
                inner join voucher_fant c on a.fant_id=c.id\
                inner join voucher_month d on a.month_id=d.id\
                inner join voucher_acc_sirshak e on e.id=b.acc_sirshak_id\
                where a.aaba_id=? and a.office_id=? and a.fant_id in (${fants}) and month_id in(${months})\
                group by a.aaba_id,a.office_id,a.month_id,a.fant_id,c.fant_name,a.sirshak_id order by d.month_order,a.fant_id,b.display_order`;
    connection.query(query1, [user.aaba_id, user.office_id], (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        return res.status(200).json({ message: "डाटा सफलतापुर्वक प्राप्त भयो", data: data })
    })
})
router.post('/getVoucherMaster', (req, res) => {
    let user = req.body;
    console.log(user);
    let query1 = "select * from voucher_sirshak where isactive=1 order by display_order";
    let query2 = "select * from voucher_fant where isactive=1 and office_id=? order by display_order";
    let query4 = "select * from voucher_napa where isactive=1 and office_id=? order by display_order";
    let query5 = "select office_id,vstart,vlength,CONCAT(vstart,vlength) as parm FROM voucher_parameter where office_id=? and isactive=1";
    connection.query(query1, (err, sirshaks) => {
        if (err) { return; }
        connection.query(query2, [user.office_id], (err, fants) => {
            if (err) { return; }
            connection.query(query4, [user.office_id], (err, napas) => {
                if (err) { return; }
                connection.query(query5, [user.office_id], (err, params) => {
                    if (err) { return; }
                    return res.status(200).json({
                        message: "डाटा सफलतापुर्वक प्राप्त भयो", data: {
                            sirshaks: sirshaks,
                            fants: fants,
                            napas: napas,
                            params: params,
                        }
                    })
                })
            })

        })
    })
});
router.post('/getTodaysVoucher', (req, res) => {
    let user = req.body;
    console.log(req.body);
    const now = new Date();
    const value = date.format(now, 'YYYY-MM-DD');
    console.log("current date and time : " + value)
    squery = "SELECT a.id,a.ndate_voucher,a.ndate_transaction,a.voucherno,a.sirshak_id,a.amount,DATE_FORMAT(a.created_at,'%Y-%m-%d') as created_at,a.created_by_user_id,a.deposited_by,b.sirshak_name,c.napa_name,e.fant_name,f.nepname from voucher a\
        INNER JOIN voucher_sirshak b on\
        a.sirshak_id=b.id \
        inner join voucher_napa c on\
        a.office_id=c.office_id and\
        a.napa_id=c.id\
        inner join voucher_fant e on \
        a.fant_id=e.id\
        inner join users f on\
        a.created_by_user_id=f.id \
        WHERE a.created_by_user_id=? and DATE_FORMAT(a.created_at,'%Y-%m-%d')=?\
        order by a.created_at";
    connection.query(squery, [user.created_by_user_id, value], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "डाटा सफलतापुर्वक प्राप्त भयो", data: results });
        }
        else {
            return res.status(400).json({ message: err });
        }
    })
})
router.post('/loadSingleVoucher', (req, res) => {
    let user = req.body;
    console.log(req.body);
    const now = new Date();
    const value = date.format(now, 'YYYY-MM-DD');
    console.log("current date and time : " + value)
    squery = "SELECT a.id,a.ndate_transaction,a.ndate_voucher,a.voucherno,a.sirshak_id,a.amount,DATE_FORMAT(a.created_at,'%Y-%m-%d') as created_at,a.created_by_user_id,a.deposited_by,b.sirshak_name,c.napa_name,e.fant_name,f.nepname from voucher a\
        INNER JOIN voucher_sirshak b on\
        a.sirshak_id=b.id \
        inner join voucher_napa c on\
        a.office_id=c.office_id and\
        a.napa_id=c.id\
        inner join voucher_fant e on \
        a.fant_id=e.id\
        inner join users f on\
        a.created_by_user_id=f.id \
        WHERE a.aaba_id=? and a.office_id=? and a.voucherno=?\
        order by a.created_at";
    connection.query(squery, [user.aaba_id, user.office_id, user.voucherno], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "डाटा सफलतापुर्वक प्राप्त भयो", data: results });
        }
        else {
            return res.status(400).json({ message: err });
        }
    })
})
//add or edit voucher
router.post('/addOrUpdateVoucher', (req, res) => {
    let user = req.body;
    console.log("got from client", user);
    if (user.id > 0) {
        uquery = "update voucher set aaba_id=?,office_id=?,edate_voucher=?,ndate_voucher=?,edate_transaction=?,ndate_transaction=?,month_id=?,sirshak_id=?,fant_id=?,napa_id=?,voucherno=?,amount=?,updated_by_user_id=?,deposited_by=UPPER(?),updated_by_ip=? where id=?"
        connection.query(uquery, [user.aaba_id, user.office_id, user.edate_voucher, user.ndate_voucher, user.edate_transaction, user.ndate_transaction, user.month_id, user.sirshak_id, user.fant_id, user.napa_id, user.voucherno, user.amount, user.created_by_user_id, user.deposited_by, req.clientIp, user.id], (err, results) => {
            if (!err) {
                return res.status(200).json({ status: true, action: "success", message: "भौचर नं " + user.voucherno + " सफलतापुर्वक संशोधन भयो ।" })
            }
            else {
                console.log(err);
                return res.status(200).json({ status: false, action: "failed", message: err })
            }
        })
    }
    else {
        checkquery = "select a.*,b.nepname from voucher a\
        inner join users b on a.created_by_user_id=b.id\
        where a.office_id=? and a.voucherno=?";
        connection.query(checkquery, [user.office_id, user.voucherno], (err, results) => {
            console.log("results", results);
            if (results.length <= 0) {
                iquery = "insert into voucher(aaba_id,office_id,edate_voucher,ndate_voucher,edate_transaction,ndate_transaction,month_id,sirshak_id,fant_id,napa_id,voucherno,amount,deposited_by,created_by_user_id,created_by_ip) values(?,?,?,?,?,?,?,?,?,?,?,?,UPPER(?),?,?)"
                connection.query(iquery, [user.aaba_id, user.office_id, user.edate_voucher, user.ndate_voucher, user.edate_transaction, user.ndate_transaction, user.month_id, user.sirshak_id, user.fant_id, user.napa_id, user.voucherno, user.amount, user.deposited_by, user.created_by_user_id, req.clientIp], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ status: true, action: "success", message: "भौचर नं " + user.voucherno + " सफलतापुर्वक दर्ता भयो ।" })
                    } else {
                        console.log(err);
                    }

                })
            }
            else {
                return res.status(200).json({ status: false, action: "warning", message: "भौचर नं‌ " + user.voucherno + " मितिः  " + results[0].ndate + " मा " + results[0].nepname + " बाट दर्ता भईसकेको छ ।" })
            }
        })
    }



})
router.get('/getVoucherDetailsById/:id', (req, res) => {
    console.log(req.params.id);
    query = "select * from voucher where id=? ";
    connection.query(query, req.params.id, (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "डाटा प्राप्त भयो", data: results });
        }
        else {
            return res.status(500).json({ message: "डाटा प्राप्त हुन सकेन", data: err });
        }
    })
})
router.post('/deleteVoucherById', (req, res) => {
    let user = req.body;
    console.log("got from client", user);
    let query = `insert into voucher_deleted(id,aaba_id,office_id,edate_voucher,ndate_voucher,edate_transaction,ndate_transaction,month_id,sirshak_id,fant_id,napa_id,voucherno,amount,deposited_by,created_at,created_by_user_id,created_by_ip,updated_at,updated_by_user_id,updated_by_ip,deleted_by_user_id,deleted_by_ip) (select a.*,'${user.user_id}' as deleted_by_user_id,'${req.clientIp}' as deleted_by_ip from voucher a where id=${user.id})`;
    console.log(query);
    connection.query(query, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        let query1 = `delete from voucher where id='${user.id}'`;
        connection.query(query1, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            else {
                return res.status(200).json({ status: true, message: "भौचर सफलतापुर्क हटाईयो ।" });
            }
        })

    })
})



module.exports = router;