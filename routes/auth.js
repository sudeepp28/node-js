const express=require('express');
const dbConnection = require('../mongoDb');
const router=express.Router();


const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
router.post('/register',async(req,resp)=>{
  const db=await dbConnection();
  const users=db.collection('users')
    const { name, email, password } = req.body;
     const existingUser = await users.findOne({ email });
  if (existingUser) return resp.status(400).send({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { name, email, password: hashedPassword };

  const result = await users.insertOne(newUser);

  

  resp.send(result);
});
router.post('/login',async (req,resp)=>{
   const db = await dbConnection();
  const users = db.collection('users');
  const { email, password } = req.body;

  const user = await users.findOne({ email });
  if (!user) return resp.status(400).send({ message: 'Invalid email or password' });

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) return resp.status(400).send({ message: 'Invalid email or password' });

  const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1h' });

  resp.send({ token, user});
})
module.exports=router