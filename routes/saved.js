
const express=require('express');
const dbConnection = require('../mongoDb');
const router=express.Router();

router.get('/', async(req,resp)=>{
  let db=await dbConnection();
  let collection=db.collection('saved restaurants');
  let data=await collection.find().toArray()
  resp.send(data)
})
router.post('/',async(req,resp)=>{
  let db=await dbConnection()
 let collection=db.collection('saved restaurants');
  let result= await collection.insertOne(req.body)
  resp.send(result)
})

router.delete('/:_id',async(req,resp)=>{

   
    let db= await dbConnection();
    let collection=db.collection('saved restaurants')
    let result=await collection.deleteOne(req.params);
    resp.send(result)
})

module.exports=router