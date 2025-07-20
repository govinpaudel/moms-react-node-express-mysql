const express = require('express');
const pool = require('../Libraries/connection');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
  res.send('Hello from Admin Route page');
});

// user routes
router.post('/listUsers', async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT a.*, b.office_name FROM users a 
       INNER JOIN offices b ON a.office_id = b.id 
       WHERE a.role = 2 AND a.office_id = ? 
       ORDER BY a.office_id`,
      [req.body.office_id]
    );
    return res.status(200).json({ message: 'डाटा सफलतापुर्वक प्राप्त भयो', data: users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error', error: err });
  }
});

router.post('/changeUserStatus', async (req, res) => {
  const user = req.body;
  const newStatus = user.status == 1 ? 0 : 1;
  try {
    const [result] = await pool.query(
      'UPDATE users SET isactive = ?, updated_by_user_id = ? WHERE office_id = ? AND id = ?',
      [newStatus, user.updated_by_user_id, user.office_id, user.user_id]
    );
    return res.status(200).json({ status: true, message: 'प्रयोगकर्ता सफलतापुर्वक संशोधन भयो', data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error', error: err });
  }
});

router.post('/resetPassword', async (req, res) => {
  const user = req.body;
  const newpassword = 'User@123$';
  const hash = bcrypt.hashSync(newpassword, 10);
  try {
    const [result] = await pool.query(
      'UPDATE users SET password = ?, updated_by_user_id = ? WHERE office_id = ? AND id = ?',
      [hash, user.updated_by_user_id, user.office_id, user.user_id]
    );
    return res.status(200).json({
      status: true,
      message: `प्रयोगकर्ताको पासवर्ड ${newpassword} अपडेट भयो`,
      data: result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error', error: err });
  }
});

// List all fants by office
router.post('/listFants', async (req, res) => {
    const { office_id } = req.body;
    try {
        const [fants] = await pool.query("SELECT * FROM voucher_fant WHERE office_id = ? ORDER BY display_order", [office_id]);
        return res.status(200).json({
            message: "डाटा सफलतापुर्वक प्राप्त भयो",
            data: fants
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "सर्भर त्रुटि भयो" });
    }
});

// Change fant status (active/inactive)
router.post('/changeFantStatus', async (req, res) => {
    const { office_id, fant_id, status } = req.body;
    try {
        const newStatus = status == 1 ? 0 : 1;
        await pool.query("UPDATE voucher_fant SET isactive = ? WHERE office_id = ? AND id = ?", [newStatus, office_id, fant_id]);
        return res.status(200).json({
            status: true,
            message: "फाँट सफलतापुर्वक संशोधन भयो"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "सर्भर त्रुटि भयो" });
    }
});

// Get single fant by ID
router.post('/getFantById', async (req, res) => {
    const { office_id, fant_id } = req.body;
    try {
        const [results] = await pool.query("SELECT * FROM voucher_fant WHERE office_id = ? AND id = ?", [office_id, fant_id]);
        return res.status(200).json({
            message: "डाटा सफलतापुर्वक प्राप्त भयो",
            data: results
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "सर्भर त्रुटि भयो" });
    }
});

// Add or update fant
router.post('/addOrUpdateFants', async (req, res) => {
    const { id, office_id, fant_name, display_order } = req.body;
    try {
        if (id == 0) {
            const [result] = await pool.query(
                "INSERT INTO voucher_fant (office_id, fant_name, display_order, isactive) VALUES (?, ?, ?, ?)",
                [office_id, fant_name, display_order, 1]
            );
            return res.status(200).json({
                status: true,
                message: "डाटा सफलतापुर्वक दर्ता भयो",
                data: result
            });
        } else {
            const [result] = await pool.query(
                "UPDATE voucher_fant SET fant_name = ?, display_order = ? WHERE id = ?",
                [fant_name, display_order, id]
            );
            return res.status(200).json({
                status: true,
                message: "डाटा सफलतापुर्वक संशोधन भयो",
                data: result
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "सर्भर त्रुटि भयो" });
    }
});
// List all staff for an office
router.post('/listStaffs', async (req, res) => {
    const { office_id } = req.body;
    try {
        const [staffs] = await pool.query(
            "SELECT * FROM voucher_staff WHERE office_id = ? ORDER BY display_order",
            [office_id]
        );
        return res.status(200).json({
            message: "कर्मचारीहरु सफलतापुर्वक प्राप्त भयो",
            data: staffs
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "सर्भर त्रुटि भयो" });
    }
});

// Change staff active/inactive status
router.post('/changeStaffStatus', async (req, res) => {
    const { office_id, staff_id, status } = req.body;
    try {
        const newStatus = status == 1 ? 0 : 1;
        const [result] = await pool.query(
            "UPDATE voucher_staff SET isactive = ? WHERE office_id = ? AND id = ?",
            [newStatus, office_id, staff_id]
        );
        return res.status(200).json({
            status: true,
            message: "कर्मचारी सफलतापुर्वक संशोधन भयो",
            data: result
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "सर्भर त्रुटि भयो" });
    }
});

// Get staff by ID
router.post('/getStaffById', async (req, res) => {
    const { office_id, staff_id } = req.body;
    try {
        const [results] = await pool.query(
            "SELECT * FROM voucher_staff WHERE office_id = ? AND id = ?",
            [office_id, staff_id]
        );
        return res.status(200).json({
            message: "डाटा सफलतापुर्वक प्राप्त भयो",
            data: results
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "सर्भर त्रुटि भयो" });
    }
});

// Add or update staff
router.post('/addOrUpdateStaffs', async (req, res) => {
    const { id, office_id, staff_name, display_order } = req.body;
    try {
        if (id == 0) {
            const [result] = await pool.query(
                "INSERT INTO voucher_staff (office_id, staff_name, display_order, isactive) VALUES (?, ?, ?, ?)",
                [office_id, staff_name, display_order, 1]
            );
            return res.status(200).json({
                status: true,
                message: "डाटा सफलतापुर्वक दर्ता भयो",
                data: result
            });
        } else {
            const [result] = await pool.query(
                "UPDATE voucher_staff SET staff_name = ?, display_order = ? WHERE id = ?",
                [staff_name, display_order, id]
            );
            return res.status(200).json({
                status: true,
                message: "डाटा सफलतापुर्वक संशोधन भयो",
                data: result
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "सर्भर त्रुटि भयो" });
    }
});
// List all napas
router.post('/listNapas', async (req, res) => {
    const { office_id } = req.body;
    try {
        const [napas] = await pool.query(
            "SELECT * FROM voucher_napa WHERE office_id = ? ORDER BY display_order",
            [office_id]
        );
        return res.status(200).json({
            message: "नगरपालिकाहरु सफलतापुर्वक प्राप्त भयो",
            data: napas
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "सर्भर त्रुटि भयो" });
    }
});

// Change napa status
router.post('/changeNapaStatus', async (req, res) => {
    const { office_id, napa_id, status } = req.body;
    try {
        const newStatus = status == 1 ? 0 : 1;
        const [result] = await pool.query(
            "UPDATE voucher_napa SET isactive = ? WHERE office_id = ? AND id = ?",
            [newStatus, office_id, napa_id]
        );
        return res.status(200).json({
            status: true,
            message: "नगरपालिका सफलतापुर्वक संशोधन भयो",
            data: result
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "सर्भर त्रुटि भयो" });
    }
});

// Get napa by ID
router.post('/getNapaById', async (req, res) => {
    const { office_id, napa_id } = req.body;
    try {
        const [results] = await pool.query(
            "SELECT * FROM voucher_napa WHERE office_id = ? AND id = ?",
            [office_id, napa_id]
        );
        return res.status(200).json({
            message: "डाटा सफलतापुर्वक प्राप्त भयो",
            data: results
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "सर्भर त्रुटि भयो" });
    }
});

// Add or update napa
router.post('/addOrUpdateNapas', async (req, res) => {
    const { napa_id, office_id, napa_name, display_order } = req.body;
    try {
        if (napa_id == 0) {
            const [lastRow] = await pool.query(
                "SELECT COALESCE(MAX(id), 0) + 1 AS no FROM voucher_napa WHERE office_id = ?",
                [office_id]
            );
            const newId = lastRow[0].no;

            const [result] = await pool.query(
                "INSERT INTO voucher_napa (id, office_id, napa_name, display_order, isactive) VALUES (?, ?, ?, ?, ?)",
                [newId, office_id, napa_name, display_order, 1]
            );
            return res.status(200).json({
                status: true,
                message: "नगरपालिका सफलतापुर्वक दर्ता भयो",
                data: result
            });
        } else {
            const [result] = await pool.query(
                "UPDATE voucher_napa SET napa_name = ?, display_order = ? WHERE id = ? AND office_id = ?",
                [napa_name, display_order, napa_id, office_id]
            );
            return res.status(200).json({
                status: true,
                message: "नगरपालिका सफलतापुर्वक संशोधन भयो",
                data: result
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "सर्भर त्रुटि भयो" });
    }
});

// List parameters
router.post('/listParms', async (req, res) => {
    const { office_id } = req.body;
    try {
        const [parms] = await pool.query(
            "SELECT * FROM voucher_parameter WHERE office_id = ?",
            [office_id]
        );
        return res.status(200).json({
            message: "डाटा सफलतापुर्वक प्राप्त भयो",
            data: parms
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "सर्भर त्रुटि भयो" });
    }
});

// Change parameter active status
router.post('/changeParmStatus', async (req, res) => {
    const { office_id, id, status } = req.body;
    const newStatus = status == 1 ? 0 : 1;
    try {
        const [result] = await pool.query(
            "UPDATE voucher_parameter SET isactive = ? WHERE office_id = ? AND id = ?",
            [newStatus, office_id, id]
        );
        return res.status(200).json({
            status: true,
            message: "भौचर लम्बाई तथा शूरुअंक सफलतापुर्वक संशोधन भयो",
            data: result
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "सर्भर त्रुटि भयो" });
    }
});

// Get parameter by ID
router.post('/getParmById', async (req, res) => {
    const { office_id, id } = req.body;
    try {
        const [results] = await pool.query(
            "SELECT * FROM voucher_parameter WHERE office_id = ? AND id = ?",
            [office_id, id]
        );
        return res.status(200).json({
            message: "डाटा सफलतापुर्वक प्राप्त भयो",
            data: results
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "सर्भर त्रुटि भयो" });
    }
});

// Add or update parameters
router.post('/addOrUpdateParms', async (req, res) => {
    const { id, office_id, vstart, vlength } = req.body;
    try {
        if (id == 0) {
            const [result] = await pool.query(
                "INSERT INTO voucher_parameter (office_id, vstart, vlength, isactive) VALUES (?, ?, ?, ?)",
                [office_id, vstart, vlength, 1]
            );
            return res.status(200).json({
                status: true,
                message: "डाटा सफलतापुर्वक दर्ता भयो",
                data: result
            });
        } else {
            const [result] = await pool.query(
                "UPDATE voucher_parameter SET vstart = ?, vlength = ? WHERE id = ?",
                [vstart, vlength, id]
            );
            return res.status(200).json({
                status: true,
                message: "डाटा सफलतापुर्वक संशोधन भयो",
                data: result
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "सर्भर त्रुटि भयो" });
    }
});

module.exports = router;