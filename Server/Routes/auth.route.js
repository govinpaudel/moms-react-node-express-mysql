const express = require('express')
const connection = require('../Libraries/connection')
const bcrypt = require('bcryptjs')
const router = express.Router();
const { signAccessToken, signRefreshToken, verifyAccesstoken, verifyRefreshtoken } = require('../libraries/jwt_helper');
const createError = require('http-errors');

router.get('/', async (req, res, next) => { res.send("Hello from authpage") })

router.post('/register', async (req, res, next) => {
    const data = req.body;
    // console.log(data);
    try {
        const query = "select * from users where email=?";
        connection.query(query, [data.username, data.email], (err, result) => {
            if (!err) {
                if (result.length > 0) {
                    return res.status(200).json({ status: 201, message: `Email:${data.email} or Username:${data.username} is already registered.` })
                }
                else {
                    const hash = bcrypt.hashSync(data.password, 10);
                    const query = "insert into users (email,password,nepname,engname,contactno,officeid,role,status) values(?,?,?,?,?,?,?,?)";
                    connection.query(query, [data.email, hash, data.nepname, data.engname, data.contactno, data.officeid, "1", "0"], (err, result) => {
                        if (!err) {
                            return res.status(200).json({ status: 200, message: `Userid ${data.username} is registered successfully.` })
                        }
                        else {
                            next(err.message)
                        }
                    });
                }
            }
            else {
                next(err.message)
            }
        })

    } catch (err) {
        next(err)
    }
})
router.post('/login', async (req, res, next) => {
    let user = req.body
    const query = "select a.*,b.state_id,b.office_name,c.state_name from users a\
    inner join offices b on a.office_id=b.id\
    inner join states c on b.state_id=c.id where a.email=?"
    connection.query(query, [user.email], async (err, result) => {
        try {
            if (!err) {
                if (result.length > 0) {
                    console.log(result)
                    if (!result[0].isactive) {
                        return res.status(401).json({ status: 401, message: `प्रयोगकर्ता सक्रिय गरिएको छैन । कृपया व्यवस्थापकलाई सम्पर्क गर्नुहोला ।` })
                    }
                    else {
                        const checkPassword = bcrypt.compareSync(user.password, result[0].password)
                        if (!checkPassword) {
                            return res.status(401).json({ status: 401, message: `प्रयोगकर्ता वा पासवर्ड मिलेन ।` })
                        }
                        else {
                            const datatoadd = result[0]
                            delete datatoadd.password;
                            const atoken = await signAccessToken(result[0].id)
                            const rtoken = await signRefreshToken(result[0].id)
                            return res.status(200).json({ status: 200, access_token: atoken, refresh_token: rtoken, data: datatoadd, message: `सफलतापुर्वक लगईन भयो ।` })
                        }
                    }
                }
                else {
                    return res.status(401).json({ status: 401, message: `प्रयोगकर्ता वा पासवर्ड मिलेन ।` })
                }
            }
            else (                
                next(err)
            )
        } catch (err) {
            next(err)
        }
    })
})
router.post('/changepassword', verifyAccesstoken, async (req, res, next) => {
    res.status(200).json({ message: "I am changepassword" })
})
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
router.get('/getAllOffices', async (req, res, next) => {
    let query = "select * from offices where isactive='1'";
    try {
        connection.query(query, (err, result) => {
            if (err) next(err.message)
            res.send({ data: result })
        })
    } catch (err) {
        next(err)
    }
})
router.get('/getAllAabas', async (req, res, next) => {
    let query = "select * from aabas where isactive='1'";
    try {
        connection.query(query, (err, result) => {
            if (err) next(err.message)
            res.send({ data: result })
        })
    } catch (err) {
        next(err)
    }    
})

router.post('/getSidebarlist', async (req, res, next) => {
    let user=req.body;
    console.log(user);
    let query = "select a.user_id,b.type,b.name,b.path from user_modules a\
    inner join modules b\
    on a.module_id=b.id\
    where a.user_id=? order by type";
    try {
        connection.query(query,[user.user_id], (err, result) => {
            if (err) next(err.message)
            res.send({ data: result })
        })
    } catch (err) {
        next(err)
    }    
})

module.exports = router