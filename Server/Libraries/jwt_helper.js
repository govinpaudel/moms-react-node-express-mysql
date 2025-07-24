require('dotenv').config();
const JWT = require('jsonwebtoken');
const createError = require('http-errors');

function signAccessToken(userid) {
    return new Promise((resolve, reject) => {
        const payload = { id: userid };  // Add useful data
        const secret_key = process.env.SECRET_KEY_TO_ACCESS;
        const options = {
            expiresIn: '8h',
            audience: userid.toString()
        };
        JWT.sign(payload, secret_key, options, (err, token) => {
            if (err) return reject(err);
            resolve(token);
        });
    });
}

function signRefreshToken(userid) {
    return new Promise((resolve, reject) => {
        const payload = {};
        const secret_key = process.env.SECRET_KEY_TO_REFRESH;
        const options = {
            expiresIn: '1y',
            audience: userid.toString()
        };
        JWT.sign(payload, secret_key, options, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}
function verifyAccesstoken(req, res, next) {
    console.log('Tokencame',req.headers['authorization']);
    if (!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    console.log('token',token)
    JWT.verify(token, process.env.SECRET_KEY_TO_ACCESS, (err, payload) => {
        if (err) {
            console.log(err.name)
            let message = 'Internal Server Error';
            if (err.name === 'JsonWebTokenError') {
                message = 'Unauthorized'
            }
            else if (err.name == 'TokenExpiredError'){
                message='Unauthorized'
            }
            else{
                message = err.name
            }
         return next(message)
        }
        else {
            req.payload = payload
            next()
        }
    })
}

function verifyRefreshtoken(refreshToken) {
    return new Promise((resolve, reject) => {
        JWT.verify(refreshToken, process.env.SECRET_KEY_TO_REFRESH, (err, payload) => {
            if (err) return reject(createError.Unauthorized())
            const userid = payload.aud
            console.log(userid)
            resolve(userid)
        })
    }
    )
}










module.exports = { signAccessToken, signRefreshToken, verifyAccesstoken, verifyRefreshtoken }

