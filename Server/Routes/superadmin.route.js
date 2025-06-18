const express = require('express')
const connection = require('../Libraries/connection')
const router = express.Router();
const date = require('date-and-time')
const bcrypt = require('bcryptjs')
router.get('/', (req, res, next) => { res.send("Hello from Admin Route page") })
// user routes starts
router.post('/listAdminUsers', (req, res) => {
    let user=req.body;
    console.log(user);
    let query="select a.*,b.office_name from users a\
    inner join offices b on a.office_id=b.id where a.role=1 order by a.office_id";
    connection.query(query, (err, users) => {
    if (err) { return; }
    return res.status(200).json({
        message: "डाटा सफलतापुर्वक प्राप्त भयो",
        data:users
    })
    })
})
router.post('/changeUserStatus', (req, res) => {
    let user=req.body;
    console.log(user);
    if(user.status==1){
        let query="update users set isactive=0,updated_by_user_id=? where id=?";
        connection.query(query,[user.updated_by_user_id,user.user_id], (err, users) => {
        if (err) { 
            console.log(err);
            return;

         }
        return res.status(200).json({
            status:true,
            message: "प्रयोगकर्ता सफलतापुर्वक संशोधन भयो",
            data:users
        })
        })
    }
    else{
        let query="update users set isactive=1,updated_by_user_id=? where id=?";
        connection.query(query,[user.updated_by_user_id,user.user_id], (err, users) => {
        if (err) { return; }
        return res.status(200).json({
            status:true,
            message: "प्रयोगकर्ता सफलतापुर्वक संशोधन भयो",
            data:users
        })
        })
    }
   
})
router.post('/resetPassword', (req, res) => {
    let user=req.body;
    console.log(user);
    const newpassword='Admin@123$'
    const hash = bcrypt.hashSync(newpassword, 10);  
    console.log(hash) ;
    let query="update users set password=?,updated_by_user_id=? where id=?";
    connection.query(query,[hash,user.updated_by_user_id,user.user_id],(err,results)=>{
        if (!err){               
            return res.status(200).json({
                status:true,
                message: `प्रयोगकर्ताको पासवर्ड ${newpassword} अपडेट भयो`,
                data:results
            }) 
        }
            else{
                console.log(err);
            }        

    })    
})
// Badhfand routes starts
router.post('/listBadhfandByStates', (req, res) => {
    let user=req.body;
    console.log(user);
    let keys = user.state_id
    console.log(keys.length);
    if(keys.length>0){
        states = keys.map((it) => {return `'${it}'`})
        console.log(states);
    }
    else{
        states=["'0'"]
    }     
    let query=`select a.*,b.state_name,c.aaba_name,d.acc_sirshak_name from voucher_badhfadh a\
    inner join states b on a.state_id=b.id\
    inner join aabas c on a.aaba_id=c.id \
    inner join voucher_acc_sirshak d on a.acc_sirshak_id=d.id\
    where\
    a.aaba_id=${user.aaba_id} and a.state_id in (${states})`;
    console.log(query);
    connection.query(query, (err, badhfand) => {
        if (err) { 
            console.log(err);
            return;
         }
        return res.status(200).json({
            message: "डाटा सफलतापुर्वक प्राप्त भयो",
            data:badhfand
        })
        })
});
router.post('/getBadhfandById', (req, res) => {
    let user=req.body;
    console.log(user);    
    let query="select a.*,b.state_name,c.aaba_name,d.sirshak_name from voucher_badhfadh a\
    inner join states b on a.state_id=b.id\
    inner join aabas c on a.aaba_id=c.id \
    inner join voucher_sirshak d on a.acc_sirshak_id=d.id\
    where a.id=?";
        connection.query(query,[user.id], (err, results) => {
            if (err) { return; }
            return res.status(200).json({
                message: "डाटा सफलतापुर्वक प्राप्त भयो",
                data:results
            })
            })       
    
});
router.post('/updateBadhfand', (req, res) => {
    let user=req.body;
    console.log(user);   
        let query="update voucher_badhfadh set sangh=?,pardesh=?,isthaniye=?,sanchitkosh=? where id=?";
        connection.query(query,[user.sangh,user.pardesh,user.isthaniye,user.sanchitkosh,user.id], (err, results) => {
            if (err) { 
                console.log(err);
                return; }
            return res.status(200).json({
                status:true,
                message: "डाटा सफलतापुर्वक संशोधन भयो",
                data:results
            })        
        });    
});
// state routes starts
router.post('/listStates', (req, res) => {
    let user=req.body;
    console.log(user);
    let query="select * from states";
    connection.query(query,[user.aaba_id], (err, states) => {
        if (err) { return; }
        return res.status(200).json({
            message: "प्रदेशहरु सफलतापुर्वक प्राप्त भयो",
            states:states
        })
        })
});
//offices route starts
router.post('/listOfficesByStates', (req, res) => {
    let user=req.body;
    console.log(user);
    let keys = user.state_id
    console.log(keys.length);
    if(keys.length>0){
        states = keys.map((it) => {return `'${it}'`})
        console.log(states);
    }
    else{
        states=["'0'"]
    }        
    let query=`select a.*,b.state_name from offices a\
    inner join states b on a.state_id=b.id where a.state_id in (${states})`;
    connection.query(query,[user.state_id], (err, offices) => {
        if (err) { 
            console.log(err);
            return;
         }
        return res.status(200).json({
            message: "कार्यालयहरु सफलतापुर्वक प्राप्त भयो",
            offices:offices
        })
        })
});
router.post('/getOfficesById', (req, res) => {
    let user=req.body;
    console.log(user);    
        let query="select a.*,b.state_name from offices a\
        inner join states b on a.state_id=b.id where a.id=?";
        connection.query(query,[user.id], (err, results) => {
            if (err) { 
                console.log(err)
                return;
            }
            return res.status(200).json({
                message: "डाटा सफलतापुर्वक प्राप्त भयो",
                data:results
            })
            })       
    
});
router.post('/updateStateOfOffice', (req, res) => {
    let user=req.body;
    console.log(user);    
        let query="update offices set state_id=?,isvoucherchecked=? where id=?";
        connection.query(query,[user.state_id,user.isvoucherchecked,user.id], (err, results) => {
            if (err) { 
                console.log(err);
                return; }
            return res.status(200).json({
                status:true,
                message: "डाटा सफलतापुर्वक संशोधन भयो",
                data:results
            })
            })
    });
module.exports = router;