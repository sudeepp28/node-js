const express=require('express');
const cors=require('cors')
const app= express();
// const dbConnection=require('./mongoDb.js');
//   const { ObjectId } = require('mongodb');
// const mongodb=require('mongodb');

// const Fuse = require('fuse.js');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const authMiddleware = require('./middleware.js')

const savedRoute=require('./routes/saved')
const RestaurantsRoute=require('./routes/resturants')
const cartRoute=require('./routes/cart')
const orderRoute=require('./routes/order')
const searchRoute=require('./routes/search')
const authRoute=require('./routes/auth')
const verify=require('./middleware/auth-middleware')

app.use(express.json())
app.use(cors());

app.use('/',RestaurantsRoute)
app.use('/cart',verify,cartRoute)
app.use('/order',verify,orderRoute)
app.use('/saved',savedRoute)
app.use('/searches',searchRoute)
app.use('/',authRoute)




app.listen(5000)