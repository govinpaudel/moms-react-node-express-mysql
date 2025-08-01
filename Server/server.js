require('dotenv').config();
const express=require("express");
const cors=require("cors");
const morgan=require("morgan");
const app=express();
const PORT = process.env.API_PORT || 3000
const {verifyAccesstoken}=require('./Libraries/jwt_helper');
// import routes
const authRoute = require('./Routes/auth.route');
const voucherRoute = require('./Routes/voucher.route');
const bargikaranRoute=require('./Routes/bargikaran.route')
const misilRoute=require('./Routes/misil.route');
const adminRoute=require('./Routes/admin.route');
const superadminRoute=require('./Routes/superadmin.route');
const requestIp =require("request-ip");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(requestIp.mw());
app.set('trust proxy', true);
// lets handle request coming from frontend
app.use('/api/auth', authRoute);
app.use('/api/voucher',verifyAccesstoken,voucherRoute);
app.use('/api/bargikaran',verifyAccesstoken,bargikaranRoute);
app.use('/api/misil',verifyAccesstoken,misilRoute);
app.use('/api/admin',verifyAccesstoken,adminRoute);
app.use('/api/superadmin',superadminRoute);
app.get('/api/', async (req, res, next) => { res.send("Hello from Main Server Page") })

app.use((err, req, res,next) => {
    res.status(err.status || 500)
    console.log(err);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message || "Internal Server Error",
        }
    })

})

app.listen(PORT, () => {
    console.log(`server is running in port ${PORT}`)
})
