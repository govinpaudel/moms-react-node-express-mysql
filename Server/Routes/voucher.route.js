const express = require('express')
const connection = require('../Libraries/connection')
const router = express.Router();
const date = require('date-and-time')
router.get('/', (req, res, next) => { res.send("Hello from voucherpage") })

router.post('/VoucherMonthly', (req, res) => {
    let user = req.body;
    console.log(user);
    let query1 = "select a.aaba_id,a.office_id,a.sirshak_id,b.sirshak_name,sum(amount) amount from voucher a\
    inner join voucher_sirshak b on\
    a.sirshak_id = b.id\
    where aaba_id=? and office_id=? and month_id=? and sirshak_id=2\
    group by aaba_id,office_id,sirshak_id";
    let query2 = "select a.aaba_id,a.office_id,a.sirshak_id,b.sirshak_name,sum(a.amount) as amount,sum(a.amount*(d.sanchitkosh)/100) as sanchitkosh,sum(a.amount*(d.pardesh)/100) as pardesh,sum(a.amount*(d.isthaniye)/100) as isthaniye from voucher a\
    inner join voucher_sirshak b on a.sirshak_id = b.id\
    inner join offices c on a.office_id=c.id\
    inner join voucher_badhfadh d on a.aaba_id=d.aaba_id and a.sirshak_id=d.sirshak_id and c.state_id=d.pardes_id\
    where a.aaba_id=? and a.office_id=? and a.month_id=? and a.sirshak_id=2\
    group by a.aaba_id,a.office_id,a.sirshak_id";
    let query3="select a.aaba_id,a.office_id,a.sirshak_id,b.sirshak_name,a.napa_id,e.napa_name,sum(a.amount) as amount,sum(a.amount*(d.sanchitkosh)/100) as sanchitkosh,sum(a.amount*(d.pardesh)/100) as pardesh,sum(a.amount*(d.isthaniye)/100) as isthaniye from voucher a\
    inner join voucher_sirshak b on a.sirshak_id = b.id\
    inner join offices c on a.office_id=c.id\
    inner join voucher_badhfadh d on a.aaba_id=d.aaba_id and a.sirshak_id=d.sirshak_id and c.state_id=d.pardes_id\
    inner join voucher_napa e on a.napa_id=e.id\
    where a.aaba_id=? and a.office_id=? and a.month_id=? and a.sirshak_id=2\
    group by a.aaba_id,a.office_id,a.sirshak_id,b.sirshak_name,a.napa_id,e.napa_name";
    let query4="select a.aaba_id,a.office_id,a.sirshak_id,b.sirshak_name,sum(a.amount) as amount,sum(a.amount*(d.sanchitkosh)/100) as sanchitkosh,sum(a.amount*(d.pardesh)/100) as pardesh,sum(a.amount*(d.isthaniye)/100) as isthaniye from voucher a\
    inner join voucher_sirshak b on a.sirshak_id = b.id\
    inner join offices c on a.office_id=c.id\
    inner join voucher_badhfadh d on a.aaba_id=d.aaba_id and a.sirshak_id=d.sirshak_id and c.state_id=d.pardes_id\
    inner join voucher_napa e on a.napa_id=e.id\
    where a.aaba_id=? and a.office_id=? and a.month_id=? and a.sirshak_id !=1\
    group by a.aaba_id,a.office_id,a.sirshak_id,b.sirshak_name"
    connection.query(query1, [user.aaba_id, user.office_id, user.monthid], (err, registration) => {
        if (err) { return; }        
        connection.query(query2, [user.aaba_id, user.office_id, user.monthid], (err, summary) => {
            if (err) { return; }
            connection.query(query3, [user.aaba_id, user.office_id, user.monthid], (err, isthaniye) => {
                if (err) { return; } 
                connection.query(query4, [user.aaba_id, user.office_id, user.monthid], (err, pardesh) => {
                    if (err) { return; }               
            return res.status(200).json({
                message: "डाटा सफलतापुर्वक प्राप्त भयो", data: {
                    registration: registration,
                    summary: summary,
                    isthaniye:isthaniye,
                    pardesh:pardesh
                }
            })
        })
        })
        })
    })

})




router.post('/getVoucherMaster', (req, res) => {
    let user = req.body;
    console.log(user);
    let query1 = "select * from voucher_sirshak where isactive=1 order by display_order";
    let query2 = "select * from voucher_fant where isactive=1 and office_id=? order by display_order";
    let query3 = "select * from voucher_staff where isactive=1 and office_id=? order by display_order";
    let query4 = "select * from voucher_napa where isactive=1 and office_id=? order by display_order";
    let query5 = "select office_id,vstart,vlength,CONCAT(vstart,vlength) as parm FROM voucher_parameter where office_id=? and isactive=1";
    connection.query(query1, (err, sirshaks) => {
        if (err) { return; }
        connection.query(query2, [user.office_id], (err, fants) => {
            if (err) { return; }
            connection.query(query3, [user.office_id], (err, staffs) => {
                if (err) { return; }
                connection.query(query4, [user.office_id], (err, napas) => {
                    if (err) { return; }
                    connection.query(query5, [user.office_id], (err, params) => {
                        if (err) { return; }
                        return res.status(200).json({
                            message: "डाटा सफलतापुर्वक प्राप्त भयो", data: {
                                sirshaks: sirshaks,
                                fants: fants,
                                staffs: staffs,
                                napas: napas,
                                params: params,
                            }
                        })
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
    squery = "SELECT a.id,a.ndate,a.voucherno,a.sirshak_id,a.amount,DATE_FORMAT(a.created_at,'%Y-%m-%d') as created_at,a.created_by_user_id,a.remarks,b.sirshak_name,c.napa_name,e.fant_name,d.staff_name,f.nepname from voucher a\
        INNER JOIN voucher_sirshak b on\
        a.sirshak_id=b.id \
        inner join voucher_napa c on\
        a.office_id=c.office_id and\
        a.napa_id=c.id\
        inner join voucher_staff d on\
        a.staff_id=d.id\
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
    squery = "SELECT a.id,a.ndate,a.voucherno,a.sirshak_id,a.amount,DATE_FORMAT(a.created_at,'%Y-%m-%d') as created_at,a.created_by_user_id,a.remarks,b.sirshak_name,c.napa_name,e.fant_name,d.staff_name,f.nepname from voucher a\
        INNER JOIN voucher_sirshak b on\
        a.sirshak_id=b.id \
        inner join voucher_napa c on\
        a.office_id=c.office_id and\
        a.napa_id=c.id\
        inner join voucher_staff d on\
        a.staff_id=d.id\
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





module.exports = router;