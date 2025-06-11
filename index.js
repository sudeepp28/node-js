const express=require('express');
const cors=require('cors')
const app= express();
const dbConnection=require('./mongoDb.js');
  const { ObjectId } = require('mongodb');
// const mongodb=require('mongodb');

const Fuse = require('fuse.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware.js')

app.use(express.json())
app.use(cors());


app.get('/',async(req,resp)=>{
    let db= await dbConnection();
    let collection=db.collection('restaurants')
    data= await collection.find().toArray()
    console.log(data)
    resp.send(data)
})
app.put('/:id', async (req, resp) => {
  try {
    let db = await dbConnection();
    let collection = db.collection('restaurants');

    // Validate ID format before using ObjectId
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return resp.status(400).send({ message: 'Invalid ID format' });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    if (result.modifiedCount === 0) {
      return resp.status(404).send({ message: 'Item not found or no change made' });
    }

    resp.send(result);
  } catch (error) {
    console.error('Error in PUT /cart/:id ->', error);
    resp.status(500).send({ message: 'Internal server error', error });
  }
});
app.get('/cart',async(req,resp)=>{
    let db= await dbConnection();
    let collection=db.collection('cart')
    data= await collection.find().toArray()
   
    resp.send(data)
})
app.post('/cart',async (req,resp)=>{
    let db= await dbConnection();
    let collection=db.collection('cart')
    let result= await collection.insertOne(req.body)
    resp.send(result)
})


app.put('/cart/:id',async (req, resp) => {
  try {
    let db = await dbConnection();
    let collection = db.collection('cart');

    // Validate ID format before using ObjectId
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return resp.status(400).send({ message: 'Invalid ID format' });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    if (result.modifiedCount === 0) {
      return resp.status(404).send({ message: 'Item not found or no change made' });
    }

    resp.send(result);
  } catch (error) {
    console.error('Error in PUT /cart/:id ->', error);
    resp.status(500).send({ message: 'Internal server error', error });
  }
});

app.delete('/cart/delete',async(req,resp)=>{

    
    let db= await dbConnection();
    let collection=db.collection('cart')
    let result=await collection.deleteMany({});
    resp.send(result)
})
app.delete('/cart/:_id',authMiddleware,async(req,resp)=>{

   console.log(req.params)
    let db= await dbConnection();
    let collection=db.collection('cart')
    let result=await collection.deleteOne({_id:new ObjectId(req.params._id)});
    resp.send(result)
})

app.get('/order', async(req,resp)=>{
  let db=await dbConnection();
  let collection=db.collection('orders');
  let data=await collection.find().toArray()
  resp.send(data)
})

app.post('/order',async(req,resp)=>{
  let db=await dbConnection()
  let collection=db.collection('orders');
  let result= await collection.insertOne(req.body)
  resp.send(result)
})

app.get('/saved', async(req,resp)=>{
  let db=await dbConnection();
  let collection=db.collection('saved restaurants');
  let data=await collection.find().toArray()
  resp.send(data)
})
app.post('/saved',async(req,resp)=>{
  let db=await dbConnection()
 let collection=db.collection('saved restaurants');
  let result= await collection.insertOne(req.body)
  resp.send(result)
})

app.delete('/saved/:_id',async(req,resp)=>{

   
    let db= await dbConnection();
    let collection=db.collection('saved restaurants')
    let result=await collection.deleteOne(req.params);
    resp.send(result)
})


app.get('/searches', async (req, resp) => {
  const db = await dbConnection();
  const collection = db.collection('restaurants');
  const query = req.query.q?.trim();

  if (!query) {
    return resp.send({ result: [] });
  }

  const data = await collection.find().toArray();

  const options = {
    includeScore: true,
    threshold: 0.4, 
    keys: ['name', 'dishes.name'] 
  };

  const fuse = new Fuse(data, options);
  const result = fuse.search(query).map(r => r.item);

  resp.send({ result });
});

app.post('/register',async(req,resp)=>{
  const db=await dbConnection();
  const users=db.collection('users')
    const { name, email, password } = req.body;
     const existingUser = await users.findOne({ email });
  if (existingUser) return resp.status(400).send({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { name, email, password: hashedPassword };

  const result = await users.insertOne(newUser);

  const token = jwt.sign({ userId: result.insertedId }, 'yourSecretKey', { expiresIn: '1h' });

  resp.send({ token });
});
app.post('/login',async (req,resp)=>{
   const db = await dbConnection();
  const users = db.collection('users');
  const { email, password } = req.body;

  const user = await users.findOne({ email });
  if (!user) return resp.status(400).send({ message: 'Invalid email or password' });

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) return resp.status(400).send({ message: 'Invalid email or password' });

  const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1h' });

  resp.send({ token });
})

app.get('/login',async(req,resp)=>{
  const db =await dbConnection();
  const collection=db.collection('users');
  let result= await collection.find().toArray()
  resp.send(result)
})

app.listen(5000)