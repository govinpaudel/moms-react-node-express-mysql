const express = require('express')
const connection = require('../Libraries/connection')
const router = express.Router();

router.get('/', (req, res, next) => { res.send("Hello from kitta route page") })


router.post('/getDetails',(req,res)=>{
    let user=req.body;
    console.log(user);    
    let query1="select a.F2,a.F6,a.f3,a.f4,a.f5 from kitta a where a.F13=9 AND a.F15=2";
    let query2="select distinct a.F12,a.F13,a.F15,a.F19,a.f18,a.f20,a.f21 from kitta a where a.F13=9 AND a.F15=2";
        connection.query(query1,[user.ward_no,user.kitta],(err,results)=>{
            if(!err){
                console.log(results);
                return res.status(200).json({message:"डाटा प्राप्त भयो",data:results});
            }
            else{
                console.log(err);
                return res.status(500).json({message:"डाटा प्राप्त हुन सकेन", data:err });
            }
        }) 
})
module.exports = router;;