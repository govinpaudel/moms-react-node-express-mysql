const express = require('express')
const pool = require('../Libraries/connection')
const bcrypt = require('bcryptjs')
const router = express.Router();
const { signAccessToken, signRefreshToken, verifyAccesstoken, verifyRefreshtoken } = require('../Libraries/jwt_helper');
const createError = require('http-errors');


//route without tokens
router.get('/', async (req, res, next) => { res.send("Hello from auth Routepage") })
router.post('/register', async (req, res, next) => {
    try {
        const data = req.body;
        const query = "select * from users where username=? or email=?";
        const [results] = await pool.query(query, [data.username, data.email]);
        console.log(results);
        if (results.length > 0) {
            return res.status(200).json({ status: false, message: `Email:${data.email} or Username:${data.username} is already registered.` })
        }
        else {
            const hash = bcrypt.hashSync(data.password, 10);
            const query1 = "insert into users (username,email,password,nepname,engname,contactno,office_id,role,isactive) values(?,?,?,?,?,?,?,?,?)";
            const results1 = await pool.query(query1, [data.username, data.email, hash, data.nepname, data.engname, data.contactno, data.officeid, "2", "0"]);
            if (results1) {
                let query2 = `insert into user_modules(user_id,office_id,module_id,isactive)
    (SELECT DISTINCT users.id as user_id,users.office_id,modules.id as module_id,1 as isactive FROM users,modules where users.id=?)`
                const results2 = await pool.query(query2, [results1.insertId]);
                return res.status(200).json({ status: true, message: `Userid ${data.username} is registered successfully.` })
            }
        }
    } catch (error) {
        next(error)
    }
})
router.post('/login', async (req, res, next) => {
    try {
        let user = req.body;
        const query = "select a.*,b.state_id,b.office_name,b.isvoucherchecked,b.usenepcalendar,c.state_name,d.role_name from users a\
    inner join offices b on a.office_id=b.id\
    inner join user_roles d on a.role=d.id\
    inner join states c on b.state_id=c.id where a.username=?";
        const [result] = await pool.query(query, [user.username]);
        if (!result[0].isactive) {
            return res.status(401).json({ status: false, message: `प्रयोगकर्ता सक्रिय गरिएको छैन । कृपया व्यवस्थापकलाई सम्पर्क गर्नुहोला ।` })
        }
        const checkPassword = bcrypt.compareSync(user.password, result[0].password);
        if (!checkPassword) {
            return res.status(401).json({ status: false, message: `प्रयोगकर्ता वा पासवर्ड मिलेन ।` })
        }
        const datatoadd = result[0]
        delete datatoadd.password;
        const atoken = await signAccessToken(result[0].id)
        const rtoken = await signRefreshToken(result[0].id)
        return res.status(200).json({ status: true, access_token: atoken, refresh_token: rtoken, data: datatoadd, message: `सफलतापुर्वक लगईन भयो ।` })
    } catch (error) {
        return res.status(401).json({ status: false, message: `प्रयोगकर्ता वा पासवर्ड मिलेन ।` })
    }
})
router.get('/getAllOffices', async (req, res, next) => {
    try {
        let query = "select * from offices where isactive='1'";
        const [results] = await pool.query(query);
        return res.status(200).json({ status: true, data: results, message: `डाटा प्राप्त भयो ।` })
    } catch (error) {
        next(error)
    }
})
router.get('/getAllAabas', async (req, res, next) => {
    try {
        const [rows] = await pool.query("select * from aabas where isactive='1'");
        console.log(rows);
        return res.status(200).json({ status: true, data: rows, message: `डाटा प्राप्त भयो ।` })
    } catch (error) {
        next(error);
    }
});
//routes with token
router.post('/changepassword',verifyAccesstoken, async (req, res) => {
    const { user_id, oldpassword, newpassword } = req.body;

    try {
        const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [user_id]);

        if (users.length === 0) {
            return res.status(400).json({ message: "गलत प्रयोगकर्ता द्वारा प्रयास गरिएको ।" });
        }

        const user = users[0];
        const passwordMatch = bcrypt.compareSync(oldpassword, user.password);

        if (!passwordMatch) {
            return res.status(200).json({ message: "गलत पुरानो पासवर्ड ।" });
        }

        const hashedNewPassword = bcrypt.hashSync(newpassword, 10);

        const [updateResult] = await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedNewPassword, user_id]);

        return res.status(200).json({ status: true, message: "पासवर्ड परिवर्तन सफल भयो ।" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "सर्भर त्रुटि भयो", error: err });
    }
});
router.post('/refresh-token', async (req, res, next) => {
    try {
        const { oldrefreshToken } = req.body
        if (!oldrefreshToken) throw createError.BadRequest()
        const userid = await verifyRefreshtoken(oldrefreshToken)
        const accessToken = await signAccessToken(userid)
        const refreshToken = await signRefreshToken(userid)
        res.send({ accessToken, refreshToken })
    } catch (err) {
        next(err.message)
    }
})
router.post('/getSidebarlist',verifyAccesstoken, async (req, res, next) => {
    try {
        let user = req.body;
        console.log(user);
        let query = `select a.user_id,b.module,b.name,b.path from user_modules a
        inner join modules b
        on a.module_id=b.id
        where a.user_id=? and b.module=? order by b.module,b.display_order`;
        const [result] = await pool.query(query, [user.user_id, user.module]);
        res.send({ data: result })
    } catch (error) {
        next(error);
    }
})

module.exports = router