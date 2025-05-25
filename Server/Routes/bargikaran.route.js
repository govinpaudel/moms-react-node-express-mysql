const express = require('express');
const connection = require('../Libraries/connection')
const router = express.Router();


router.get('/', (req, res, next) => { res.send("Hello from bargikaran route page") })

router.get('/getAllOffices/:id', (req, res) => {
    query = "select * from brg_ofc where office_id=?";
    connection.query(query, req.params.id, (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "डाटा प्राप्त भयो", data: results });
        }
        else {
            console.log(err);
            return res.status(500).json({ message: "डाटा प्राप्त हुन सकेन", data: err });
        }
    })
})
router.get('/getNapasByOfficeId/:officeid', (req, res) => {
    query = "select * from brg_ofc_np where office_id=? order by napa_name";
    connection.query(query, req.params.officeid, (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "डाटा प्राप्त भयो", data: results });
        }
        else {
            return res.statusCode(500).json({ message: "डाटा प्राप्त हुन सकेन", data: err });
        }
    })
})
router.get('/getGabisasByOfficeId/:officeid/:napaid', (req, res) => {
    query = "select * from brg_ofc_np_gb where office_id=? and napa_id=? order by gabisa_name";
    connection.query(query, [req.params.officeid, req.params.napaid], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "डाटा प्राप्त भयो", data: results });
        }
        else {
            return res.statusCode(500).json({ message: "डाटा प्राप्त हुन सकेन", data: err });
        }
    })
})

router.get('/getWardsByGabisaId/:officeid/:napaid/:gabisaid', (req, res) => {
    query = "select distinct ward_no from brg_ofc_np_gb_wd where office_id=? and napa_id=? and gabisa_id=? order by ward_no";
    connection.query(query, [req.params.officeid, req.params.napaid, req.params.gabisaid], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "डाटा प्राप्त भयो", data: results });
        }
        else {
            console.log(err)
            return res.status(500).json({ message: "डाटा प्राप्त हुन सकेन", data: err });
        }
    })
})

router.post('/getKittaDetails', (req, res) => {
    let user = req.body;
    console.log(user);
    query = "select * from bargikaran where office_id=? and napa_id=? and gabisa_id=? and ward_no=? and kitta_no=?";
    connection.query(query, [user.office_id, user.napa_id, user.gabisa_id, user.ward_no, user.kitta_no], (err, results) => {
        if (!err) {
            if (results.length > 0) {
                return res.status(200).json({ message: "जम्माः " + results.length + " डाटा प्राप्त भयो", data: results });
            }
            else {
                return res.status(200).json({ message: "कुनै पनि रेकर्ड प्राप्त भएन ।", data: results });
            }
        }
        else {
            return res.status(500).json({ message: "डाटा प्राप्त हुन सकेन", data: err });
        }
    })

})
router.post('/savebargikaran', (req, res) => {
    let user = req.body;
    console.log(user);
    let query = `insert into bargikaran(office_id,office_name,napa_id,napa_name,gabisa_id,gabisa_name,sheet_no,ward_no,kitta_no,bargikaran,remarks,created_by_user_id)(SELECT office_id,office_name,napa_id,napa_name,gabisa_id,gabisa_name,'${user.ward_no}' as ward_no,'${user.ward_no}' as sheet_no,'${user.kitta_no}' as kitta_no,'${user.bargikaran}' as bargikaran,'${user.remarks}' as remarks,'${user.user_id}' as created_by_user_id FROM brg_ofc_np_gb
    where office_id='${user.office_id}' and napa_id='${user.napa_id}' and gabisa_id='${user.gabisa_id}')`;
    console.log(query);
    connection.query(query, (err, results) => {
        if (err) {
            console.log(err);
        }
        else {            
            return res.status(200).json({ status:true,message: "डाटा सफलतापुर्वक सेभ भयो", data: results });
        }
    })
})


module.exports = router;