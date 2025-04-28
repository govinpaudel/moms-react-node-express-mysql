const express = require('express')
const connection = require('../Libraries/connection')
const router = express.Router();

router.get('/', (req, res, next) => { res.send("Hello from misil route page") })

router.get('/getTypesByOfficeId/:officeid', (req, res)=>{
    query="select distinct a.id as misil_type_id,a.misil_type_name from misil_type a\
    inner join misil_pokas b on\
    a.id=b.misil_type_id\
    where b.office_id=?";
    connection.query(query,req.params.officeid,(err,results)=>{
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

router.get('/getAabaByOffice/:officeid/:typeid', (req, res)=>{
    query="select distinct a.aaba_id,aaba_name from misil_pokas a\
    inner join aabas b on a.aaba_id=b.id where \
    a.office_id=? and misil_type_id=?\
    order by aaba_id";
    console.log(req.params.officeid,req.params.typeid);
    connection.query(query,[req.params.officeid,req.params.typeid],(err,results)=>{
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


router.post('/getpoka',(req,res)=>{
    let user=req.body;
    console.log(user);
    console.log(user.miti.length);
    console.log(user.minum.length);
    if(user.miti.length>0 && user.minum.length>0 ){
        let query1="select a.*,b.id as pokaid,b.misil_poka_name,d.misil_type_name from misil a\
        inner join misil_pokas b on a.poka_id=b.id\
        inner join aabas c on b.aaba_id=c.id\
        inner join misil_type d on b.misil_type_id=d.id\
        where b.aaba_id=? and b.office_id=? and b.misil_type_id=? and miti=? and minum=?\
        order by b.aaba_id,b.office_id,b.misil_type_id,d.misil_type_name,a.miti,a.minum,b.misil_poka_name";
        connection.query(query1,[user.aaba_id,user.office_id,user.misil_type_id,user.miti,user.minum],(err,results)=>{
            if(!err){
                console.log(results);
                return res.status(200).json({message:"डाटा प्राप्त भयो",data:results});
            }
            else{
                console.log(err);
                return res.status(500).json({message:"डाटा प्राप्त हुन सकेन", data:err });
            }
        })


    }
    else if(user.miti.length>0 && user.minum.length==0){
        let query1="select a.*,b.id as pokaid,b.misil_poka_name,d.misil_type_name from misil a\
        inner join misil_pokas b on a.poka_id=b.id\
        inner join aabas c on b.aaba_id=c.id\
        inner join misil_type d on b.misil_type_id=d.id\
        where b.aaba_id=? and b.office_id=? and b.misil_type_id=? and miti=? \
        order by b.aaba_id,b.office_id,b.misil_type_id,d.misil_type_name,a.miti,a.minum,b.misil_poka_name";
        connection.query(query1,[user.aaba_id,user.office_id,user.misil_type_id,user.miti],(err,results)=>{
            if(!err){
                console.log(results);
                return res.status(200).json({message:"डाटा प्राप्त भयो",data:results});
            }
            else{
                console.log(err);
                return res.status(500).json({message:"डाटा प्राप्त हुन सकेन", data:err });
            }
        })
    }
    else if(user.miti.length==0 && user.minum.length>0){
        let query1="select a.*,b.id as pokaid,b.misil_poka_name,d.misil_type_name from misil a\
        inner join misil_pokas b on a.poka_id=b.id\
        inner join aabas c on b.aaba_id=c.id\
        inner join misil_type d on b.misil_type_id=d.id\
        where b.aaba_id=? and b.office_id=? and b.misil_type_id=?  and minum=?\
        order by b.aaba_id,b.office_id,b.misil_type_id,d.misil_type_name,a.miti,a.minum,b.misil_poka_name";
        connection.query(query1,[user.aaba_id,user.office_id,user.misil_type_id,user.minum],(err,results)=>{
            if(!err){
                console.log(results);
                return res.status(200).json({message:"डाटा प्राप्त भयो",data:results});
            }
            else{
                console.log(err);
                return res.status(500).json({message:"डाटा प्राप्त हुन सकेन", data:err });
            }
        })
    

    }
})
module.exports = router;;