require('dotenv').config();
const express=require("express");
const cors=require("cors");
const morgan=require("morgan");
const app=express();
const PORT = process.env.API_PORT || 3000
const {verifyAccesstoken}=require('./libraries/jwt_helper');
// import routes
const authRoute = require('./Routes/auth.route');
const voucherRoute = require('./Routes/voucher.route');
const bargikaranRoute=require('./Routes/bargikaran.route')
const misilRoute=require('./Routes/misil.route')

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));



// lets handle request coming from frontend
app.use('/auth', authRoute);
app.use('/voucher', voucherRoute);
app.use('/bargikaran',bargikaranRoute);
app.use('/misil',misilRoute);

app.get('/', async (req, res, next) => { res.send("Hello from Main Server Page") })

app.use((err, req, res, next) => {
    res.status(err.status || 500)
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
