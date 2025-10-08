const express = require('express');
const pool = require('../Libraries/connection');
const router = express.Router();
const fs = require('fs');
const path = require('path')
const axios = require("axios");

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
    else {
      const query = `
      INSERT INTO bargikaran (
        office_id, office_name, napa_id, napa_name, gabisa_id, gabisa_name,
        sheet_no, ward_no, kitta_no, bargikaran, remarks, created_by_user_id,updated_by_user_id
      )
      SELECT 
        office_id, office_name, napa_id, napa_name, gabisa_id, gabisa_name,
        ?,?,?,?,?,?,?
      FROM brg_ofc_np_gb
      WHERE office_id=? AND napa_id=? AND gabisa_id=?`;
      const params = [
        user.ward_no,
        user.ward_no,
        user.kitta_no,
        user.bargikaran,
        user.remarks,
        user.user_id,
        user.user_id,
        user.office_id,
        user.napa_id,
        user.gabisa_id,
      ];
      const [results] = await pool.query(query, params);
      res.status(200).json({ status: true, message: `कित्ता नं ${user.kitta_no} को वर्गिकरण सेभ भयो ।`, data: results });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "डाटा सेभ गर्न सकेन", data: error });
  }
});

// ✅ Get data by date
router.get('/getDataByDate/:date', async (req, res, next) => {
  try {
    const { date } = req.params;
    // Validate date format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ status: false, message: "Invalid date format" });
    }
    const query = `SELECT * FROM bargikaran WHERE DATE(created_at) >= ? OR DATE(updated_at) >= ?`;
    const [results] = await pool.query(query, [date, date]);
    res.status(200).json({ message: "डाटा प्राप्त भयो", data: results });
  } catch (error) {
    next(error);
  }
});

router.post('/getCookiebyUser', async (req, res, next) => {
  let user = req.body;
  console.log(user);
  const form = new URLSearchParams({
    hidBioDataForUser: "",
    txtCapturedFIR: "",
    j_username: user.username,
    j_password: user.password,
  });
  try {
    const response = await axios.post(
      "http://10.7.252.13/lrims/j_spring_security_check",
      form.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        maxRedirects: 0,           // stop at 302
        validateStatus: () => true // allow 302
      }
    );
    const setCookie = response.headers["set-cookie"];
    const jsession = setCookie
      .map(c => c.split(";")[0])
      .find(c => c.startsWith("JSESSIONID="));
    res.status(200).json({ status: true, message: "डाटा प्राप्त भयो", data: jsession });
  } catch (error) {
    console.log(error);
  }
})

router.get('/getGabisalist', async (req, res, next) => {
  try {
    const response = await axios.get('http://10.7.252.13/lrims/app/fillDropDown/getData/forarcieve/41/D_MVDC/24066/1')
    res.status(200).json({ status: true, message: "डाटा प्राप्त भयो", data: response.data });
  } catch (error) {
    console.log(error);
  }
})

router.get('/getDataByGabisa/:id/:sessionid', async (req, res, next) => {
  try {
    console.log(req.params.id, req.params.sessionid);
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': req.params.sessionid
    };
    const formData = new URLSearchParams();
    formData.append('ddlReportsDistrict', '41');
    formData.append('ddlReportsMunicipalityVDC', req.params.id);
    formData.append('ddlLandDetailsWardNumber', '');
    const response = await axios.post('http://10.7.252.13/lrims/app/LandOwnerPersonReportSpecific/', formData.toString(), { headers, timeout: 60000 });    
    res.status(200).json({ status: true, message: "डाटा प्राप्त भयो", data: response.data });
  } catch (error) {
    console.log(error);
  }
})












module.exports = router;
