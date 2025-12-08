require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require('path');
const requestIp = require("request-ip");

const app = express();
const PORT = process.env.API_PORT || 3000;
const FRONTEND_DEV = 'http://localhost:5173';
const FRONTEND_PROD = 'http://bargikaran.infinityfreeapp.com';
const FRONTEND_PROD1 = 'https://kitta.infinityfreeapp.com';
const FRONTEND_PROD2 = 'http://kitta.infinityfreeapp.com';
const FRONTEND_PROD3 = 'http://kitta.infinityfreeapp.com';


// JWT helper
const { verifyAccesstoken } = require('./Libraries/jwt_helper');

// import routes
const authRoute = require('./Routes/auth.route');
const voucherRoute = require('./Routes/voucher.route');
const adminRoute = require('./Routes/admin.route');
const superadminRoute = require('./Routes/superadmin.route');

// -------------------- MIDDLEWARE --------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(requestIp.mw());
app.set('trust proxy', true);
app.use('/api/downloads', express.static(path.join(__dirname, 'downloads')));

// -------------------- CORS --------------------
// Allow both dev and production frontend
const corsOptions = {    
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

// -------------------- ROUTES --------------------
app.use('/api/auth', authRoute);
app.use('/api/voucher', verifyAccesstoken, voucherRoute);
app.use('/api/admin', verifyAccesstoken, adminRoute);
app.use('/api/superadmin', superadminRoute);

app.get('/api/', (req, res) => {
    res.send("Hello from Main Server Page");
});

// -------------------- ERROR HANDLER --------------------
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send({
        error: {
            status: err.status || 500,
            message: err.message || "Internal Server Error",
        }
    });
});

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);    
});
