const express = require('express');
const pool = require('../Libraries/connection');
const router = express.Router();
const fs = require('fs');
const path = require('path')

router.get('/', (req, res) => {
  res.send("Hello from bargikaran route page");
});

// ✅ Get all offices
router.get('/getAllOffices/:id', async (req, res, next) => {
  try {
    const query = "SELECT * FROM brg_ofc WHERE office_id=?";
    const [results] = await pool.query(query, [req.params.id]);
    res.status(200).json({ message: "डाटा प्राप्त भयो", data: results });
  } catch (error) {
    next(error);
  }
});

// ✅ Get Napas
router.get('/getNapasByOfficeId/:officeid', async (req, res, next) => {
  try {
    const query = "SELECT * FROM brg_ofc_np WHERE office_id=? ORDER BY napa_name";
    const [results] = await pool.query(query, [req.params.officeid]);
    res.status(200).json({ message: "डाटा प्राप्त भयो", data: results });
  } catch (error) {
    next(error);
  }
});

// ✅ Get Gabisas
router.get('/getGabisasByOfficeId/:officeid/:napaid', async (req, res, next) => {
  try {
    const query = "SELECT * FROM brg_ofc_np_gb WHERE office_id=? AND napa_id=? ORDER BY gabisa_name";
    const [results] = await pool.query(query, [req.params.officeid, req.params.napaid]);
    res.status(200).json({ message: "डाटा प्राप्त भयो", data: results });
  } catch (error) {
    next(error);
  }
});

// ✅ Get Wards
router.get('/getWardsByGabisaId/:officeid/:napaid/:gabisaid', async (req, res, next) => {
  try {
    const query = `
      SELECT DISTINCT ward_no 
      FROM brg_ofc_np_gb_wd 
      WHERE office_id=? AND napa_id=? AND gabisa_id=? 
      ORDER BY ward_no`;
    const [results] = await pool.query(query, [
      req.params.officeid,
      req.params.napaid,
      req.params.gabisaid,
    ]);
    res.status(200).json({ message: "डाटा प्राप्त भयो", data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "डाटा प्राप्त हुन सकेन", data: error });
  }
});

// ✅ Get Kitta Details for edit

router.get('/getKittaDetailsForEdit/:id', async (req, res, next) => {
  try {
    const query = `select * from bargikaran where id=?`
    const [results] = await pool.query(query, [req.params.id]);
    res.status(200).json({ message: "रेकर्ड सफलतापुर्वक प्राप्त भयो ।", data: results });
  } catch (error) {
    next(error)
  }
})


// ✅ Get Kitta Details while searching
router.post('/getKittaDetails', async (req, res, next) => {
  try {
    const user = req.body;
    const query = `
      SELECT * FROM bargikaran 
      WHERE office_id=? AND napa_id=? AND gabisa_id=? AND ward_no=? AND kitta_no=? order by id desc`;
    const [results] = await pool.query(query, [
      user.office_id,
      user.napa_id,
      user.gabisa_id,
      user.ward_no,
      user.kitta_no,
    ]);
    if (results.length > 0) {
      res.status(200).json({ message: `जम्माः ${results.length} डाटा प्राप्त भयो`, data: results });
    } else {
      res.status(200).json({ message: "कुनै पनि रेकर्ड प्राप्त भएन ।", data: [] });
    }
  } catch (error) {
    res.status(500).json({ message: "डाटा प्राप्त हुन सकेन", data: error });
  }
});

// ✅ Save Bargikaran
router.post('/savebargikaran', async (req, res, next) => {
  try {
    const user = req.body;
    console.log(user);
    if (user.id > 0) {
      const query = 'update bargikaran set bargikaran=?,remarks=?,updated_by_user_id=? where id=?';
      const params = [user.bargikaran, user.remarks, user.user_id, user.id];
      const [results] = await pool.query(query, params);
      res.status(200).json({ status: true, message: `कित्ता नं ${user.kitta_no} को वर्गिकरण संशोधन भयो ।`, data: results });
    }
    else{
const query = `
      INSERT INTO bargikaran (
        office_id, office_name, napa_id, napa_name, gabisa_id, gabisa_name,
        sheet_no, ward_no, kitta_no, bargikaran, remarks, created_by_user_id
      )
      SELECT 
        office_id, office_name, napa_id, napa_name, gabisa_id, gabisa_name,
        ?, ?, ?, ?, ?, ?
      FROM brg_ofc_np_gb
      WHERE office_id=? AND napa_id=? AND gabisa_id=?`;
    const params = [
      user.ward_no, 
      user.ward_no, 
      user.kitta_no,
      user.bargikaran,
      user.remarks,
      user.user_id,
      user.office_id,
      user.napa_id,
      user.gabisa_id,
    ];
    const [results] = await pool.query(query, params);
    res.status(200).json({ status:true, message: `कित्ता नं ${user.kitta_no} को वर्गिकरण सेभ भयो ।`, data: results });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "डाटा सेभ गर्न सकेन", data: error });
  }
});
module.exports = router;
