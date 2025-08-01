const express = require('express');
const pool = require('../Libraries/connection');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
  res.send("Hello from Admin Route page");
});

// List admin users
router.post('/listAdminUsers', async (req, res) => {
  let user=req.body;
  console.log(user);
  try {
    const query = `SELECT a.*, b.office_name FROM users a 
                   INNER JOIN offices b ON a.office_id = b.id 
                   WHERE a.role = 1 
                   ORDER BY a.office_id`;
    const [users] = await pool.query(query);
    res.status(200).json({ message: "डाटा सफलतापुर्वक प्राप्त भयो", data: users });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Change user status
router.post('/changeUserStatus', async (req, res) => {
  const { status, updated_by_user_id, user_id } = req.body;
  try {
    const query = `UPDATE users SET isactive = ?, updated_by_user_id = ? WHERE id = ?`;
    const newStatus = status === 1 ? 0 : 1;
    const [result] = await pool.query(query, [newStatus, updated_by_user_id, user_id]);
    res.status(200).json({
      status: true,
      message: "प्रयोगकर्ता सफलतापुर्वक संशोधन भयो",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Reset password
router.post('/resetPassword', async (req, res) => {
  const { updated_by_user_id, user_id } = req.body;
  const newPassword = 'Admin@123$';
  const hash = bcrypt.hashSync(newPassword, 10);

  try {
    const query = `UPDATE users SET password = ?, updated_by_user_id = ? WHERE id = ?`;
    const [result] = await pool.query(query, [hash, updated_by_user_id, user_id]);
    res.status(200).json({
      status: true,
      message: `प्रयोगकर्ताको पासवर्ड ${newPassword} अपडेट भयो`,
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// List Badhfand by states
router.post('/listBadhfandByStates', async (req, res) => {
  const { aaba_id, state_id } = req.body;

  const states = state_id.length > 0
    ? state_id.map(id => `'${id}'`).join(',')
    : "'0'";

  try {
    const query = `
      SELECT a.*, b.state_name, c.aaba_name, d.acc_sirshak_name 
      FROM voucher_badhfadh a
      INNER JOIN states b ON a.state_id = b.id
      INNER JOIN aabas c ON a.aaba_id = c.id
      INNER JOIN voucher_acc_sirshak d ON a.acc_sirshak_id = d.id
      WHERE a.aaba_id = ? AND a.state_id IN (${states})`;
    const [results] = await pool.query(query, [aaba_id]);
    res.status(200).json({ message: "डाटा सफलतापुर्वक प्राप्त भयो", data: results });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Get Badhfand by ID
router.post('/getBadhfandById', async (req, res) => {
  const { id } = req.body;

  try {
    const query = `
      SELECT a.*, b.state_name, c.aaba_name, d.sirshak_name 
      FROM voucher_badhfadh a
      INNER JOIN states b ON a.state_id = b.id
      INNER JOIN aabas c ON a.aaba_id = c.id
      INNER JOIN voucher_sirshak d ON a.acc_sirshak_id = d.id
      WHERE a.id = ?`;
    const [results] = await pool.query(query, [id]);
    res.status(200).json({ message: "डाटा सफलतापुर्वक प्राप्त भयो", data: results });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Update Badhfand
router.post('/updateBadhfand', async (req, res) => {
  const { sangh, pardesh, isthaniye, sanchitkosh, id } = req.body;

  try {
    const query = `
      UPDATE voucher_badhfadh 
      SET sangh = ?, pardesh = ?, isthaniye = ?, sanchitkosh = ?
      WHERE id = ?`;
    const [result] = await pool.query(query, [sangh, pardesh, isthaniye, sanchitkosh, id]);
    res.status(200).json({ status: true, message: "डाटा सफलतापुर्वक संशोधन भयो", data: result });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// List States
router.post('/listStates', async (req, res) => {
  try {
    const [states] = await pool.query("SELECT * FROM states");
    res.status(200).json({ message: "प्रदेशहरु सफलतापुर्वक प्राप्त भयो", states });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// List Offices by States
router.post('/listOfficesByStates', async (req, res) => {
  const { state_id } = req.body;

  const states = state_id.length > 0
    ? state_id.map(id => `'${id}'`).join(',')
    : "'0'";

  try {
    const query = `
      SELECT a.*, b.state_name 
      FROM offices a
      INNER JOIN states b ON a.state_id = b.id 
      WHERE a.state_id IN (${states})`;
    const [offices] = await pool.query(query);
    res.status(200).json({ message: "कार्यालयहरु सफलतापुर्वक प्राप्त भयो", offices });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Get Offices by ID
router.post('/getOfficesById', async (req, res) => {
  const { id } = req.body;

  try {
    const query = `
      SELECT a.*, b.state_name 
      FROM offices a
      INNER JOIN states b ON a.state_id = b.id
      WHERE a.id = ?`;
    const [results] = await pool.query(query, [id]);
    res.status(200).json({ message: "डाटा सफलतापुर्वक प्राप्त भयो", data: results });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Update State of Office
router.post('/updateStateOfOffice', async (req, res) => {
  const { state_id, isvoucherchecked, id } = req.body;

  try {
    const query = `
      UPDATE offices 
      SET state_id = ?, isvoucherchecked = ? 
      WHERE id = ?`;
    const [result] = await pool.query(query, [state_id, isvoucherchecked, id]);
    res.status(200).json({ status: true, message: "डाटा सफलतापुर्वक संशोधन भयो", data: result });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
