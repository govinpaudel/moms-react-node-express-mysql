require('dotenv').config();
const mysql = require('mysql2');
var connection = mysql.createConnection({    
    host:process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
})
connection.connect(
    (err)=>{
        if(!err){
            console.log("connected")
        }
        else{
            console.log(err);
        }
    }
)

module.exports = connection;


 