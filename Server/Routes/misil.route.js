const express = require('express')
const connection = require('../Libraries/connection')
const router = express.Router();

router.get('/', (req, res, next) => { res.send("Hello from misil route page") })

router.get('/getTypesByOfficeId/:officeid', (req, res) => {
    query = "select distinct a.id as misil_type_id,a.misil_type_name from misil_type a\
    inner join misil_pokas b on\
    a.id=b.misil_type_id\
    where b.office_id=?";
    connection.query(query, req.params.officeid, (err, results) => {
        if (!err) {
            console.log(results);
            return res.status(200).json({ message: "डाटा प्राप्त भयो", data: results });
        }
        else {
            console.log(err);
            return res.status(500).json({ message: "डाटा प्राप्त हुन सकेन", data: err });
        }
    })
})
router.get('/getAabaByOffice/:officeid/:typeid', (req, res) => {
    query = "select distinct a.aaba_id,aaba_name from misil_pokas a\
    inner join aabas b on a.aaba_id=b.id where \
    a.office_id=? and misil_type_id=?\
    order by aaba_id";
    console.log(req.params.officeid, req.params.typeid);
    connection.query(query, [req.params.officeid, req.params.typeid], (err, results) => {
        if (!err) {
            console.log(results);
            return res.status(200).json({ message: "डाटा प्राप्त भयो", data: results });
        }
        else {
            console.log(err);
            return res.status(500).json({ message: "डाटा प्राप्त हुन सकेन", data: err });
        }
    })
})
router.post('/getpoka', (req, res) => {
    let user = req.body;
    console.log(user);
    console.log(user.miti.length);
    console.log(user.minum.length);
    if (user.miti.length > 0 && user.minum.length > 0) {
        let query1 = "select a.*,b.id as pokaid,b.misil_poka_name,d.misil_type_name from misil a\
        inner join misil_pokas b on a.poka_id=b.id\
        inner join aabas c on b.aaba_id=c.id\
        inner join misil_type d on b.misil_type_id=d.id\
        where b.aaba_id=? and b.office_id=? and b.misil_type_id=? and miti=? and minum=?\
        order by b.aaba_id,b.office_id,b.misil_type_id,d.misil_type_name,a.miti,a.minum,b.misil_poka_name";
        connection.query(query1, [user.aaba_id, user.office_id, user.misil_type_id, user.miti, user.minum], (err, results) => {
            if (!err) {
                console.log(results);
                return res.status(200).json({ message: "डाटा प्राप्त भयो", data: results });
            }
            else {
                console.log(err);
                return res.status(500).json({ message: "डाटा प्राप्त हुन सकेन", data: err });
            }
        })


    }
    else if (user.miti.length > 0 && user.minum.length == 0) {
        let query1 = "select a.*,b.id as pokaid,b.misil_poka_name,d.misil_type_name from misil a\
        inner join misil_pokas b on a.poka_id=b.id\
        inner join aabas c on b.aaba_id=c.id\
        inner join misil_type d on b.misil_type_id=d.id\
        where b.aaba_id=? and b.office_id=? and b.misil_type_id=? and miti=? \
        order by b.aaba_id,b.office_id,b.misil_type_id,d.misil_type_name,a.miti,a.minum,b.misil_poka_name";
        connection.query(query1, [user.aaba_id, user.office_id, user.misil_type_id, user.miti], (err, results) => {
            if (!err) {
                console.log(results);
                return res.status(200).json({ message: "डाटा प्राप्त भयो", data: results });
            }
            else {
                console.log(err);
                return res.status(500).json({ message: "डाटा प्राप्त हुन सकेन", data: err });
            }
        })
    }
    else if (user.miti.length == 0 && user.minum.length > 0) {
        let query1 = "select a.*,b.id as pokaid,b.misil_poka_name,d.misil_type_name from misil a\
        inner join misil_pokas b on a.poka_id=b.id\
        inner join aabas c on b.aaba_id=c.id\
        inner join misil_type d on b.misil_type_id=d.id\
        where b.aaba_id=? and b.office_id=? and b.misil_type_id=?  and minum=?\
        order by b.aaba_id,b.office_id,b.misil_type_id,d.misil_type_name,a.miti,a.minum,b.misil_poka_name";
        connection.query(query1, [user.aaba_id, user.office_id, user.misil_type_id, user.minum], (err, results) => {
            if (!err) {
                console.log(results);
                return res.status(200).json({ message: "डाटा प्राप्त भयो", data: results });
            }
            else {
                console.log(err);
                return res.status(500).json({ message: "डाटा प्राप्त हुन सकेन", data: err });
            }
        })


    }
})
router.post('/getPokasByOffice', (req, res) => {
    let user = req.body;
    console.log(user)
    var query = "SELECT a.*,b.misil_type_name,c.aaba_name,d.nepname FROM misil_pokas a\
    inner join misil_type b on\
    a.misil_type_id=b.id\
    inner join aabas c on c.id=a.aaba_id\
    inner join users d on a.created_by_user_id=d.id\
    where a.office_id=?\
    order by created_at desc";
    connection.query(query, [user.office_id], (err, results) => {
        if (!err) {
            return res.status(200).json({ data: results });
        }
        else {
            return res.status(400).json(err);
        }
    })
})
router.post('/getPokaById', (req, res) => {
    let user = req.body;
    console.log(user)
    var query = "SELECT a.*,b.misil_type_name,c.aaba_name,d.nepname FROM misil_pokas a\
    inner join misil_type b on\
    a.misil_type_id=b.id\
    inner join aabas c on c.id=a.aaba_id\
    inner join users d on a.created_by_user_id=d.id\
    where a.id=?\
    order by created_at desc";
    connection.query(query, [user.id], (err, results) => {
        if (!err) {
            return res.status(200).json({ data: results });
        }
        else {
            return res.status(400).json(err);
        }
    })
})
router.post('/getPokaDetailsById', (req, res) => {
    let user = req.body;
    console.log(user)
    var query = "SELECT a.*,b.misil_type_name,c.aaba_name,d.nepname,e.minum,e.miti,e.nibedakname,e.nibedakaddress,e.jaggadhaniname,e.jaggadhaniaddress,e.id as misil_id FROM misil_pokas a\
    inner join misil_type b on  a.misil_type_id=b.id \
    inner join aabas c on c.id=a.aaba_id \
    inner join users d on a.created_by_user_id=d.id \
	inner join misil e on a.id=e.poka_id\
    where a.id=?";
    connection.query(query, [user.id], (err, results) => {
        if (!err) {
            return res.status(200).json({ data: results });
        }
        else {
            return res.status(400).json(err);
        }
    })
})
router.post('/getMisilById', (req, res) => {
    let user = req.body;
    console.log(user)
    var query = "select * from misil where id=?";
    connection.query(query, [user.id], (err, results) => {
        if (!err) {
            return res.status(200).json({ data: results });
        }
        else {
            return res.status(400).json(err);
        }
    })
})
router.get('/getAllAabas', (req, res) => {
    var query = "select * from aabas";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json({ data: results });
        }
        else {
            console.log(err);
            return res.status(400).json(err);
        }
    })
})
router.get('/getMisilTypes', (req, res) => {
    var query = "select id,misil_type_name from misil_type";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json({ data: results });
        }
        else {
            console.log(err);
            return res.status(400).json(err);
        }
    })
})
router.post('/addOrUpdatePoka', (req, res) => {
    let user = req.body;
    console.log(user);
    if (user.id > 0) {
        var uquery = "update misil_pokas set aaba_id=?,misil_type_id=?,fant=?,remarks=?,updated_by_user_id=? where id=?";
        connection.query(uquery, [user.aaba_id, user.misil_type_id, user.fant, user.remarks, user.created_by_user_id, user.id],
            (err, results) => {
                if (!err) {
                    return res.status(200).json({ message: "पोका सफलतापूर्वक संशोधन भयो", status: true });
                }
                else {
                    console.log(err);
                    return res.status(200).json({ message: "पोका संशोधन हुन सकेन ।", status: false });
                }
            })
    }
    else {
        var squery = "select a.office_id,max(a.sno)+1 as sno,b.prefix,concat(b.prefix,max(a.sno)+1) as poka\
        from misil_pokas a\
        inner join misil_type b on\
        a.misil_type_id=b.id\
        where a.office_id=? and a.misil_type_id=?";
        connection.query(squery, [user.office_id, user.misil_type_id], (err, results) => {
            if (!err) {
                const [result] = results;
                console.log(results);
                if (result.sno == null) {
                    var sno = "1";
                    var poka = result.prefix.concat(sno);
                }
                else {
                    var sno = result.sno;
                    var poka = result.prefix.concat(result.sno);
                }
                var iquery = "insert into misil_pokas(office_id,aaba_id,misil_type_id,sno,misil_poka_name,fant,remarks,created_by_user_id)values(?,?,?,?,?,?,?,?)";
                connection.query(iquery, [user.office_id, user.aaba_id, user.misil_type_id, sno, poka, user.fant, user.remarks, user.created_by_user_id], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "पोका नाम " + poka + " सफलतापूर्वक दर्ता भयो", status: true });
                    }
                    else {
                        console.log(err);
                        return res.status(200).json({ message: "पोका नाम दर्ता हुन सकेन ।", status: false });
                    }
                })
            }
            else {
                console.log(err);
                return res.status(200).json({ message: "पोका नाम दर्ता हुन सकेन ।", action: "failed" });
            }
        })
    }

})
router.post('/getPokaForEdit', (req, res) => {
    let user = req.body;
    let query = 'select * from misil_pokas where id=?';
    connection.query(query, [user.misil_id], (err, result) => {
        if (!err) {
            return res.status(200).json({ message: "पोका विवरण  प्राप्त भयो", data: result });
        }
        else {
            console.log(err);
        }

    })
})
router.post('/AddOrUpdateMisil', (req, res) => {
    let user = req.body
    console.log(user);
    if (user.id > 0) {
        var uquery = "update misil set miti=?,minum=?,nibedakname=?,nibedakaddress=?,jaggadhaniname=?,jaggadhaniaddress=?,updated_by_user_id=? where id=?";
        connection.query(uquery, [user.miti, user.minum, user.nibedakname, user.nibedakaddress, user.jaggadhaniname, user.jaggadhaniaddress, user.userid, user.id],
            (err, results) => {
                if (!err) {
                    return res.status(200).json({ message: "मिसिल सफलतापूर्वक संशोधन भयो", status: true });
                }
                else {
                    console.log(err);
                    return res.status(200).json({ message: err, status: false });
                }
            })
    }
    else {
        var iquery = "insert into misil(poka_id,miti,minum,nibedakname,nibedakaddress,jaggadhaniname,jaggadhaniaddress,created_by_user_id) values(?,?,?,?,?,?,?,?)"
        connection.query(iquery, [user.poka_id, user.miti, user.minum, user.nibedakname, user.nibedakaddress, user.jaggadhaniname, user.jaggadhaniaddress, user.remarks, user.userid],
            (err, results) => {
                if (!err) {
                    var uquery="update misil_pokas set misilcount=misilcount+1 where id=?";
                    connection.query(uquery,[user.poka_id],(err,results)=>{
                        if(!err){
                            return res.status(200).json({ message: "मिसिल सफलतापूर्वक दर्ता भयो", status: true });
                        }
                        else{
                            console.log(err);
                            return res.status(200).json({ message: err, status: false });
                        }
                    })
                    
                }
                else {
                    console.log(err);
                    return res.status(200).json({ message: err, status: false });
                }
            })
    }

})
router.post('/deleteMisilById',(req,res)=>{
    let user = req.body;
    console.log("got from client",user);   
        let query1=`delete from misil where id='${user.id}'`;
        connection.query(query1,(err,results)=>{
            if(err){
                console.log(err);
            return;
            }
            else{
                let uquery="update misil_pokas set misilcount=misilcount-1 where id=?"
                connection.query(uquery,[user.poka_id],(err,results)=>{
                    if(!err){
                        return res.status(200).json({ status: true,message: "मिसिल सफलतापुर्क हटाईयो ।" });
                    }
                    else{
                        console.log(err);
                    }
                })
                
            }})      
})
module.exports = router;;