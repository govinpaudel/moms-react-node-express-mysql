const express = require('express')
const connection = require('../Libraries/connection')
const router = express.Router();

router.get('/', (req, res, next) => { res.send("Hello from kitta route page") })

router.post('/getDetails',(req,res)=>{
    let user=req.body;
    console.log(user);    
    let query1="select a.F2,a.F6,a.F3,a.F4,a.F5 from kitta a where a.F13=? AND a.F15=?";
    let query2="select distinct a.F12,a.F13,a.F15,a.F19,a.F18,a.F20,a.F21 from kitta a where a.F13=? AND a.F15=?";
        connection.query(query1,[user.ward_no,user.kitta_no],(err,OwnerDetails)=>{
            if(!err){                
                connection.query(query2,[user.ward_no,user.kitta_no],(err,LandDetails)=>{
                    if(!err){
                        console.log(OwnerDetails);
                        console.log(LandDetails);
                        return res.status(200).json({message:"डाटा प्राप्त भयो",OwnerDetails:OwnerDetails,LandDetails:LandDetails});

                    }
                });


                



            }
            else{
                console.log(err);
                return res.status(500).json({message:"डाटा प्राप्त हुन सकेन", data:err });
            }
        }) 
})
module.exports = router;;