const express = require('express');
const pool = require('../Libraries/connection');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello from misil route page");
});

router.get('/getTypesByOfficeId/:officeid', async (req, res,next) => {
    const query = `
    SELECT DISTINCT a.id AS misil_type_id, a.misil_type_name 
    FROM misil_type a
    INNER JOIN misil_pokas b ON a.id = b.misil_type_id
    WHERE b.office_id = ?`;

    try {
        const [results] = await pool.query(query, [req.params.officeid]);
        res.status(200).json({ message: "डाटा प्राप्त भयो", data: results });
    } catch (error) {
        next(error)
    }
});

router.get('/getAabaByOffice/:officeid/:typeid', async (req, res,next) => {
    const query = `
    SELECT DISTINCT a.aaba_id, aaba_name 
    FROM misil_pokas a
    INNER JOIN aabas b ON a.aaba_id = b.id 
    WHERE a.office_id = ? AND misil_type_id = ?
    ORDER BY aaba_id`;

    try {
        const [results] = await pool.query(query, [req.params.officeid, req.params.typeid]);
        res.status(200).json({ message: "डाटा प्राप्त भयो", data: results });
    } catch (error) {
        next(error)
    }
});

router.post('/getpoka', async (req, res,next) => {
    const user = req.body;
    console.log(user);
    let query = "";
    let params = [];
    if (user.miti.length > 0 && user.minum.length > 0) {
        query = "select a.*,b.id as pokaid,b.misil_poka_name,d.misil_type_name from misil a\
        inner join misil_pokas b on a.poka_id=b.id\
        inner join aabas c on b.aaba_id=c.id\
        inner join misil_type d on b.misil_type_id=d.id\
        where b.aaba_id=? and b.office_id=? and b.misil_type_id=? and miti=? and minum=?\
        order by b.aaba_id,b.office_id,b.misil_type_id,d.misil_type_name,a.miti,a.minum,b.misil_poka_name";
        params = [user.aaba_id, user.office_id, user.misil_type_id, user.miti, user.minum];
    } else if (user.miti.length > 0 && user.minum.length == 0) {
        query = "select a.*,b.id as pokaid,b.misil_poka_name,d.misil_type_name from misil a\
        inner join misil_pokas b on a.poka_id=b.id\
        inner join aabas c on b.aaba_id=c.id\
        inner join misil_type d on b.misil_type_id=d.id\
        where b.aaba_id=? and b.office_id=? and b.misil_type_id=? and miti=? \
        order by b.aaba_id,b.office_id,b.misil_type_id,d.misil_type_name,a.miti,a.minum,b.misil_poka_name";
        params = [user.aaba_id, user.office_id, user.misil_type_id, user.miti];
    } else if (user.miti.length == 0 && user.minum.length > 0) {
        query = "select a.*,b.id as pokaid,b.misil_poka_name,d.misil_type_name from misil a\
        inner join misil_pokas b on a.poka_id=b.id\
        inner join aabas c on b.aaba_id=c.id\
        inner join misil_type d on b.misil_type_id=d.id\
        where b.aaba_id=? and b.office_id=? and b.misil_type_id=?  and minum=?\
        order by b.aaba_id,b.office_id,b.misil_type_id,d.misil_type_name,a.miti,a.minum,b.misil_poka_name";
        params = [user.aaba_id, user.office_id, user.misil_type_id, user.minum];
    } else {
        return res.status(400).json({ message: "miti वा minum आवश्यक छ" });
    }

    try {
        const [results] = await pool.query(query, params);
        res.status(200).json({ message: "डाटा प्राप्त भयो", data: results });
    } catch (error) {
        next(error)
    }
});

router.post('/getPokasByOffice', async (req, res) => {
    const user = req.body;
    const query = `
    SELECT a.*, b.misil_type_name, c.aaba_name, d.nepname 
    FROM misil_pokas a
    INNER JOIN misil_type b ON a.misil_type_id = b.id
    INNER JOIN aabas c ON c.id = a.aaba_id
    INNER JOIN users d ON a.created_by_user_id = d.id
    WHERE a.office_id = ?
    ORDER BY created_at DESC`;

    try {
        const [results] = await pool.query(query, [user.office_id]);
        res.status(200).json({ data: results });
    } catch (error) {
       next(error)
       
    }
});

router.post('/getPokaById', async (req, res) => {
    const user = req.body;
    const query = `
    SELECT a.*, b.misil_type_name, c.aaba_name, d.nepname 
    FROM misil_pokas a
    INNER JOIN misil_type b ON a.misil_type_id = b.id
    INNER JOIN aabas c ON c.id = a.aaba_id
    INNER JOIN users d ON a.created_by_user_id = d.id
    WHERE a.id = ?
    ORDER BY created_at DESC`;

    try {
        const [results] = await pool.query(query, [user.id]);
        res.status(200).json({ data: results });
    } catch (error) {
        next(error)
    }
});

router.post('/getPokaDetailsById', async (req, res) => {
    const user = req.body;
    const query = `
    SELECT a.*, b.misil_type_name, c.aaba_name, d.nepname, 
           e.minum, e.miti, e.nibedakname, e.nibedakaddress,
           e.jaggadhaniname, e.jaggadhaniaddress, e.id AS misil_id
    FROM misil_pokas a
    INNER JOIN misil_type b ON a.misil_type_id = b.id
    INNER JOIN aabas c ON c.id = a.aaba_id
    INNER JOIN users d ON a.created_by_user_id = d.id
    INNER JOIN misil e ON a.id = e.poka_id
    WHERE a.id = ?`;

    try {
        const [results] = await pool.query(query, [user.id]);
        res.status(200).json({ data: results });
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});

router.post('/getMisilById', async (req, res) => {
    const user = req.body;
    const query = "SELECT * FROM misil WHERE id = ?";

    try {
        const [results] = await pool.query(query, [user.id]);
        res.status(200).json({ data: results });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/getAllAabas', async (req, res) => {
    const query = "SELECT * FROM aabas";
    try {
        const [results] = await pool.query(query);
        res.status(200).json({ data: results });
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});

router.get('/getMisilTypes', async (req, res) => {
    const query = "SELECT id, misil_type_name FROM misil_type";
    try {
        const [results] = await pool.query(query);
        res.status(200).json({ data: results });
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});

router.post('/addOrUpdatePoka', async (req, res) => {
    const user = req.body;

    try {
        if (user.id > 0) {
            // Update existing poka
            const updateQuery = `
        UPDATE misil_pokas 
        SET aaba_id = ?, misil_type_id = ?, fant = ?, remarks = ?, updated_by_user_id = ? 
        WHERE id = ?`;
            await pool.query(updateQuery, [
                user.aaba_id,
                user.misil_type_id,
                user.fant,
                user.remarks,
                user.created_by_user_id,
                user.id,
            ]);
            return res.status(200).json({ message: "पोका सफलतापूर्वक संशोधन भयो", status: true });
        } else {
            // Insert new poka
            const selectQuery = `
        SELECT a.office_id, MAX(a.sno)+1 AS sno, b.prefix 
        FROM misil_pokas a 
        INNER JOIN misil_type b ON a.misil_type_id = b.id 
        WHERE a.office_id = ? AND a.misil_type_id = ?`;
            const [rows] = await pool.query(selectQuery, [user.office_id, user.misil_type_id]);
            const { sno = 1, prefix } = rows[0] || {};
            const pokaName = prefix + sno;

            const insertQuery = `
        INSERT INTO misil_pokas (
          office_id, aaba_id, misil_type_id, sno, misil_poka_name,
          fant, remarks, created_by_user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            await pool.query(insertQuery, [
                user.office_id,
                user.aaba_id,
                user.misil_type_id,
                sno,
                pokaName,
                user.fant,
                user.remarks,
                user.created_by_user_id,
            ]);

            return res.status(200).json({ message: `पोका नाम ${pokaName} सफलतापूर्वक दर्ता भयो`, status: true });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "पोका दर्ता/संशोधनमा त्रुटी भयो", status: false });
    }
});
router.post('/getPokaForEdit', async (req, res) => {
    const { misil_id } = req.body;

    try {
        const [result] = await pool.query("SELECT * FROM misil_pokas WHERE id = ?", [misil_id]);
        res.status(200).json({ message: "पोका विवरण प्राप्त भयो", data: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "पोका विवरण प्राप्त गर्न सकिएन", error: err });
    }
});
router.post('/AddOrUpdateMisil', async (req, res) => {
    const user = req.body;

    try {
        if (user.id > 0) {
            // Update
            const updateQuery = `
        UPDATE misil 
        SET miti = ?, minum = ?, nibedakname = ?, nibedakaddress = ?, 
            jaggadhaniname = ?, jaggadhaniaddress = ?, updated_by_user_id = ?
        WHERE id = ?`;
            await pool.query(updateQuery, [
                user.miti,
                user.minum,
                user.nibedakname,
                user.nibedakaddress,
                user.jaggadhaniname,
                user.jaggadhaniaddress,
                user.userid,
                user.id,
            ]);

            return res.status(200).json({ message: "मिसिल सफलतापूर्वक संशोधन भयो", status: true });
        } else {
            // Insert
            const insertQuery = `
        INSERT INTO misil (
          poka_id, miti, minum, nibedakname, nibedakaddress,
          jaggadhaniname, jaggadhaniaddress, created_by_user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            await pool.query(insertQuery, [
                user.poka_id,
                user.miti,
                user.minum,
                user.nibedakname,
                user.nibedakaddress,
                user.jaggadhaniname,
                user.jaggadhaniaddress,
                user.userid,
            ]);

            // Update misilcount in misil_pokas
            const updateCountQuery = "UPDATE misil_pokas SET misilcount = misilcount + 1 WHERE id = ?";
            await pool.query(updateCountQuery, [user.poka_id]);

            return res.status(200).json({ message: "मिसिल सफलतापूर्वक दर्ता भयो", status: true });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message, status: false });
    }
});
router.post('/deleteMisilById', async (req, res) => {
    const { id, poka_id } = req.body;

    try {
        await pool.query("DELETE FROM misil WHERE id = ?", [id]);
        await pool.query("UPDATE misil_pokas SET misilcount = misilcount - 1 WHERE id = ?", [poka_id]);

        return res.status(200).json({ status: true, message: "मिसिल सफलतापूर्वक हटाईयो ।" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: "मिसिल हटाउन सकिएन", error: err });
    }
});


module.exports = router;