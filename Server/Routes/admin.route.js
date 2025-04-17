const express = require('express')
const connection = require('../Libraries/connection')
const router = express.Router();
const date = require('date-and-time')
const bcrypt = require('bcryptjs')
router.get('/', (req, res, next) => { res.send("Hello from Admin Route page") })
// user routes starts
router.post('/listUsers', (req, res) => {
    let user=req.body;
    console.log(user);
    let query="select * from users where office_id=? and role=2 order by id";
    connection.query(query,[user.office_id], (err, users) => {
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
        let query="update users set isactive=0,updated_by_user_id=? where office_id=? and id=?";
        connection.query(query,[user.updated_by_user_id,user.office_id,user.user_id], (err, users) => {
        if (err) { return; }
        return res.status(200).json({
            status:true,
            message: "प्रयोगकर्ता सफलतापुर्वक संशोधन भयो",
            data:users
        })
        })
    }
    else{
        let query="update users set isactive=1,updated_by_user_id=? where office_id=? and id=?";
        connection.query(query,[user.updated_by_user_id,user.office_id,user.user_id], (err, users) => {
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
    const hash = bcrypt.hashSync("123456", 10);  
    console.log(hash) ;
    let query="update users set password=?,updated_by_user_id=? where office_id=? and id=?";
    connection.query(query,[hash,user.updated_by_user_id,user.office_id,user.user_id],(err,results)=>{
        if (!err){               
            return res.status(200).json({
                status:true,
                message: "प्रयोगकर्ताको पासवर्ड 123456 अपडेट भयो",
                data:results
            }) 
        }
            else{
                console.log(err);
            }        

    })    
})
// fant routes starts
router.post('/listFants', (req, res) => {
    let user=req.body;
    let query="select * from voucher_fant where office_id=? order by display_order"
    connection.query(query,[user.office_id], (err, fants) => {
        if (err) { return; }
        return res.status(200).json({
            message: "डाटा सफलतापुर्वक प्राप्त भयो",
            data:fants
        })
        })
});
router.post('/changeFantStatus', (req, res) => {
    let user=req.body;
    console.log(user);
    if(user.status==1){
        let query="update voucher_fant set isactive=0 where office_id=? and id=?";
        connection.query(query,[user.office_id,user.fant_id], (err, fants) => {
        if (err) { return; }
        return res.status(200).json({
            status:true,
            message: "फाँट सफलतापुर्वक संशोधन भयो",
            data:fants
        })
        })
    }
    else{
        let query="update voucher_fant set isactive=1 where office_id=? and id=?";
        connection.query(query,[user.office_id,user.fant_id], (err, fants) => {
        if (err) { return; }
        return res.status(200).json({
            status:true,
            message: "प्रयोगकर्ता सफलतापुर्वक संशोधन भयो",
            data:fants
        })
        })
    }
   
})
router.post('/getFantById', (req, res) => {
    let user=req.body;
    console.log(user);    
        let query="select * from voucher_fant where office_id=? and id=?";
        connection.query(query,[user.office_id,user.fant_id], (err, results) => {
            if (err) { return; }
            return res.status(200).json({
                message: "डाटा सफलतापुर्वक प्राप्त भयो",
                data:results
            })
            })       
    
});
router.post('/addOrUpdateFants', (req, res) => {
    let user=req.body;
    console.log(user);
    if (user.id==0){
        let query="insert into voucher_fant(office_id,fant_name,display_order,isactive) values(?,?,?,?)";
        connection.query(query,[user.office_id,user.fant_name,user.display_order,1], (err, results) => {
            if (err) { 
                console.log(err);
                return; }
            return res.status(200).json({
                status:true,
                message: "डाटा सफलतापुर्वक दर्ता भयो",
                data:results
            })
            })    }

    else{
        let query="update voucher_fant set fant_name=?,display_order=? where id=?";
        connection.query(query,[user.fant_name,user.display_order,user.id], (err, results) => {
            if (err) { 
                console.log(err);
                return; }
            return res.status(200).json({
                status:true,
                message: "डाटा सफलतापुर्वक संशोधन भयो",
                data:results
            })
            })
    }
    
});
// staff routes starts
router.post('/listStaffs', (req, res) => {
    let user=req.body;
    let query="select * from voucher_staff where office_id=? order by display_order"
    connection.query(query,[user.office_id], (err, staffs) => {
        if (err) { return; }
        return res.status(200).json({
            message: "कर्मचारीहरु सफलतापुर्वक प्राप्त भयो",
            data:staffs
        })
        })
});
router.post('/changeStaffStatus', (req, res) => {
    let user=req.body;
    console.log(user);
    if(user.status==1){
        let query="update voucher_staff set isactive=0 where office_id=? and id=?";
        connection.query(query,[user.office_id,user.staff_id], (err, staffs) => {
        if (err) { return; }
        return res.status(200).json({
            status:true,
            message: "फाँट सफलतापुर्वक संशोधन भयो",
            data:staffs
        })
        })
    }
    else{
        let query="update voucher_staff set isactive=1 where office_id=? and id=?";
        connection.query(query,[user.office_id,user.staff_id], (err, fants) => {
        if (err) { return; }
        return res.status(200).json({
            status:true,
            message: "प्रयोगकर्ता सफलतापुर्वक संशोधन भयो",
            data:fants
        })
        })
    }
   
})
router.post('/getStaffById', (req, res) => {
    let user=req.body;
    console.log(user);    
        let query="select * from voucher_staff where office_id=? and id=?";
        connection.query(query,[user.office_id,user.staff_id], (err, results) => {
            if (err) { return; }
            return res.status(200).json({
                message: "डाटा सफलतापुर्वक प्राप्त भयो",
                data:results
            })
            })       
    
});
router.post('/addOrUpdateStaffs', (req, res) => {
    let user=req.body;
    console.log(user);
    if (user.id==0){
        let query="insert into voucher_staff(office_id,staff_name,display_order,isactive) values(?,?,?,?)";
        connection.query(query,[user.office_id,user.staff_name,user.display_order,1], (err, results) => {
            if (err) { 
                console.log(err);
                return; }
            return res.status(200).json({
                status:true,
                message: "डाटा सफलतापुर्वक दर्ता भयो",
                data:results
            })
            })    }

    else{
        let query="update voucher_staff set staff_name=?,display_order=? where id=?";
        connection.query(query,[user.staff_name,user.display_order,user.id], (err, results) => {
            if (err) { 
                console.log(err);
                return; }
            return res.status(200).json({
                status:true,
                message: "डाटा सफलतापुर्वक संशोधन भयो",
                data:results
            })
            })
    }
    
});
//Napa route starts
router.post('/listNapas', (req, res) => {
    let user=req.body;
    let query="select * from voucher_napa where office_id=? order by display_order"
    connection.query(query,[user.office_id], (err, napas) => {
        if (err) { return; }
        return res.status(200).json({
            message: "नगरपालिकाहरु सफलतापुर्वक प्राप्त भयो",
            data:napas
        })
        })
});
router.post('/changeNapaStatus', (req, res) => {
    let user=req.body;
    console.log(user);
    if(user.status==1){
        let query="update voucher_napa set isactive=0 where office_id=? and id=?";
        connection.query(query,[user.office_id,user.napa_id], (err, napas) => {
        if (err) { return; }
        return res.status(200).json({
            status:true,
            message: "नगरपालिका सफलतापुर्वक संशोधन भयो",
            data:napas
        })
        })
    }
    else{
        let query="update voucher_napa set isactive=1 where office_id=? and id=?";
        connection.query(query,[user.office_id,user.napa_id], (err, fants) => {
        if (err) { return; }
        return res.status(200).json({
            status:true,
            message: "नगरपालिका सफलतापुर्वक संशोधन भयो",
            data:fants
        })
        })
    }
   
})
router.post('/getNapaById', (req, res) => {
    let user=req.body;
    console.log(user);    
        let query="select * from voucher_napa where office_id=? and id=?";
        connection.query(query,[user.office_id,user.napa_id], (err, results) => {
            if (err) { return; }
            return res.status(200).json({
                message: "डाटा सफलतापुर्वक प्राप्त भयो",
                data:results
            })
            })       
    
});
router.post('/addOrUpdateNapas', (req, res) => {
    let user=req.body;
    console.log(user);
    if (user.napa_id==0){
        let checkquery="select max(id)+1 as no from voucher_napa where office_id=?";
        connection.query(checkquery,[user.office_id],(err,lastno)=>{
            if(err){
                console.log(err);
                return;
            }
            else{
            console.log(lastno[0].no);
            let query="insert into voucher_napa(id,office_id,napa_name,display_order,isactive) values(?,?,?,?,?)";
            connection.query(query,[lastno[0].no,user.office_id,user.napa_name,user.display_order,1], (err, results) => {
            if (err) { 
                console.log(err);
                return; }
            return res.status(200).json({
                status:true,
                message: "नगरपालिका सफलतापुर्वक दर्ता भयो",
                data:results
            })
            }) 
            }
        })



    }
    else{
        let query="update voucher_napa set napa_name=?,display_order=? where napa_id=? and office_id=?";
        connection.query(query,[user.napa_name,user.display_order,user.napa_id,user.office_id], (err, results) => {
            if (err) { 
                console.log(err);
                return; }
            return res.status(200).json({
                status:true,
                message: "नगरपालिका सफलतापुर्वक संशोधन भयो",
                data:results
            })
            })
    }
    
});
//parameter route starts
router.post('/listParms', (req, res) => {
    let user=req.body;
    let query="select * from voucher_parameter where office_id=?"
    connection.query(query,[user.office_id], (err, parms) => {
        if (err) { return; }
        return res.status(200).json({
            message: "डाटा सफलतापुर्वक प्राप्त भयो",
            data:parms
        })
        })
});
router.post('/changeParmStatus', (req, res) => {
    let user=req.body;
    console.log(user);
    if(user.status==1){
        let query="update voucher_parameter set isactive=0 where office_id=? and id=?";
        connection.query(query,[user.office_id,user.id], (err, parms) => {
        if (err) { return; }
        return res.status(200).json({
            status:true,
            message: "भौचर लम्बाई तथा शूरुअंक सफलतापुर्वक संशोधन भयो",
            data:parms
        })
        })
    }
    else{
        let query="update voucher_parameter set isactive=1 where office_id=? and id=?";
        connection.query(query,[user.office_id,user.id], (err, parms) => {
        if (err) { return; }
        return res.status(200).json({
            status:true,
            message: "भौचर लम्बाई तथा शूरुअंक सफलतापुर्वक संशोधन भयो",
            data:parms
        })
        })
    }
   
})
router.post('/getParmById', (req, res) => {
    let user=req.body;
    console.log(user);    
        let query="select * from voucher_parameter where office_id=? and id=?";
        connection.query(query,[user.office_id,user.id], (err, results) => {
            if (err) { return; }
            return res.status(200).json({
                message: "डाटा सफलतापुर्वक प्राप्त भयो",
                data:results
            })
            })       
    
});
router.post('/addOrUpdateParms', (req, res) => {
    let user=req.body;
    console.log(user);
    if (user.id==0){
        let query="insert into voucher_parameter(office_id,vstart,vlength,isactive)values(?,?,?,?)";
        connection.query(query,[user.office_id,user.vstart,user.vlength,1], (err, results) => {
            if (err) { 
                console.log(err);
                return; }
            return res.status(200).json({
                status:true,
                message: "डाटा सफलतापुर्वक दर्ता भयो",
                data:results
            })
            })    }

    else{
        let query="update voucher_parameter set vstart=?,vlength=? where id=?";
        connection.query(query,[user.vstart,user.vlength,user.id], (err, results) => {
            if (err) { 
                console.log(err);
                return; }
            return res.status(200).json({
                status:true,
                message: "डाटा सफलतापुर्वक संशोधन भयो",
                data:results
            })
            })
    }
    
});

module.exports = router;