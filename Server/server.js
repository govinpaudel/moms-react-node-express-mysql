require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require('path');
const requestIp = require("request-ip");

const app = express();
const PORT = process.env.API_PORT || 3000;
const FRONTEND_DEV = 'http://localhost:5173'; // Vite dev server
const FRONTEND_PROD = 'https://bargikaran.infinityfreeapp.com'; // replace with your deployed frontend URL

// JWT helper
const { verifyAccesstoken } = require('./Libraries/jwt_helper');

// import routes
const authRoute = require('./Routes/auth.route');
const voucherRoute = require('./Routes/voucher.route');
const bargikaranRoute = require('./Routes/bargikaran.route');
const misilRoute = require('./Routes/misil.route');
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
    origin: [FRONTEND_DEV, FRONTEND_PROD],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

// -------------------- ROUTES --------------------
app.use('/api/auth', authRoute);
app.use('/api/voucher', verifyAccesstoken, voucherRoute);
app.use('/api/bargikaran', bargikaranRoute);
app.use('/api/misil', verifyAccesstoken, misilRoute);
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
    console.log(`CORS allowed for: ${FRONTEND_DEV} and ${FRONTEND_PROD}`);
});
