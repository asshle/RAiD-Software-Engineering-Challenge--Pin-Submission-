const http = require('http')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const uuid = require('uuid');
const cors = require('cors')
const bcrypt = require('bcrypt')
require('dotenv').config()

const bcryptSaltRound = 10;

app.use(express.json())
app.use(cors())   

app.use(cors({ origin: 'http://localhost:5173' }))


const lineItem = new mongoose.Schema ({
  itemID: String, //integer for now will change to unique id 
  name: String,
  qty: Number,
  price:Number 

})
const orderSchema = new mongoose.Schema({
  customerName: String,
  address: String, 
  orderID: String, 
  totalCost: Number,
  lineItems: [lineItem]
})

const fruitSchema = new mongoose.Schema({
  itemID:Number,
  name:String,
  count:Number,
  price: Number,
  icon:String,
  color: String
})

const userSchema = new mongoose.Schema({
  email: String ,
  password: String
})


app.post('/api/submitOrder',(request, response) => {
  const order = request.body
  //!TODO insert ORDERID into the order req 
  const targetPath ="fruitstore"


  // TODO: using some password manager to handle storage of URI string for secure conn to mongodb
  var uri = "mongodb+srv://limpinpin123_db_user:uLGHoblhIudFuSGn@online-farm-stand.92bm71n.mongodb.net/" + targetPath
  const uriSetttings= "?retryWrites=true&w=majority&appName=Cluster0`"
  uri = uri+ uriSetttings

  //console.log (order)
  mongoose.set('strictQuery',false)
  mongoose.connect(uri, { family: 4 })

  let totalCost =0
  order.lineItems.forEach(element => {
    totalCost += (element.qty*element.price)
    
  });

  console.log ("totalCost",totalCost)
  
  const uniqueID = `ORD-${Math.floor(Math.random() * 900000 + 100000)}`
  try {
    const orderPayload = mongoose.model('order',orderSchema)
    const submitOrder = new orderPayload ({
      customerName: order.customerName,
      address: order.address, 
      orderID: uniqueID,
      orderStatus: "Order Submitted",
      totalCost: totalCost,
      lineItems: order.lineItems
    })
    const saved = submitOrder.save().then(result => 
      {
        response.json (result)
        //mongoose.connection.close()
      }
    )
  } catch (err) {
    response.status(400).json({ error: err.message });
  }

})



orderSchema.post('save', async function updateInventory(doc) {
  try {
    console.log(doc)
    for (const element of doc.lineItems){
      console.log("Post: number: ", element.itemID, "qty: ",element.qty )
      await mongoose.model('inventory').updateOne(
              { itemID: Number(element.itemID) },  
              { $inc: { count: -element.qty } }
            )
    }
  } catch (err) {
    console.log("failed to submit order error: ", err)
  }
 
})

app.get('/api/getInventory',(request,response)=>{
 
  const targetPath ="fruitstore"


  // TODO: using some password manager to handle storage of URI string for secure conn to mongodb
  var uri = "mongodb+srv://limpinpin123_db_user:uLGHoblhIudFuSGn@online-farm-stand.92bm71n.mongodb.net/" + targetPath
  const uriSetttings= "?retryWrites=true&w=majority&appName=Cluster0`"
  uri = uri+ uriSetttings
  
  console.log(uri)
  mongoose.set('strictQuery',false)
  mongoose.connect(uri, { family: 4 }).then(console.log("connected")) 
  .catch((err) => console.error('Connection failed:', err.message))

  const inventoryPayload = mongoose.model('inventory',fruitSchema,'inventory')
  inventoryPayload.find({}).then( result =>{
    //console.log(result)
    
    response.json(result)
  })
  //console.log(inventoryPayload)
})

app.get('/api/getInventoryCustomer',(request,response)=>{
 
  const targetPath ="fruitstore"
  // TODO: using some password manager to handle storage of URI string for secure conn to mongodb
  var uri = "mongodb+srv://limpinpin123_db_user:uLGHoblhIudFuSGn@online-farm-stand.92bm71n.mongodb.net/" + targetPath
  const uriSetttings= "?retryWrites=true&w=majority&appName=Cluster0`"
  uri = uri+ uriSetttings
  
  console.log(uri)
  mongoose.set('strictQuery',false)
  mongoose.connect(uri, { family: 4 }).then(console.log("connected")) 
  .catch((err) => console.error('Connection failed:', err.message))

  const inventoryPayload = mongoose.model('inventory',fruitSchema,'inventory')
  inventoryPayload.find({count:{$gt: 0}}).then( result =>{
    //console.log(result)
    
    response.json(result)
  })
  //console.log(inventoryPayload)
})

app.post('/api/login',async (request, response) =>
{
  const targetPath ="fruitstore"
  // TODO: using some password manager to handle storage of URI string for secure conn to mongodb
  var uri = "mongodb+srv://limpinpin123_db_user:uLGHoblhIudFuSGn@online-farm-stand.92bm71n.mongodb.net/" + targetPath
  const uriSetttings= "?retryWrites=true&w=majority&appName=Cluster0`"

  uri = uri+uriSetttings
  console.log(uri)
  mongoose.set('strictQuery',false)
  await mongoose.connect(uri, { family: 4 }).then(console.log("connected")) .catch((err) => console.error('Connection failed:', err.message))
  const userPayload = mongoose.model('users',userSchema,'users')

  const user = request.body

  bcrypt.genSalt(bcryptSaltRound, function(err, salt) {
    bcrypt.hash(user.password, salt,function(err, hash) {
          console.log("generated:", hash)

      });
  })

  userPayload.findOne({ email: user.email }).then( element =>{
    if (!element) {
        return response.status(401).json({ error: 'Invalid email or password' })
    }
    console.log(element)
    bcrypt.compare(user.password,element.password , function(err, result) {
      if (result === true) {
          // Passwords match, grant access
          console.log("Password Match")
          response.json({success: true})
      } else {
          // Passwords do not match, deny access
          console.log("Password do not match")
          return response.status(401).json({success: false,error: 'Invalid email or password' })
      }
    })
  }). catch(err =>
    {
      console.error('Error finding user:', err.message)
      response.status(500).json({success: false, error: err.message })
    }
  )
 
})

app.get('/api/getAllOrders', async (request, response) => {
    try {
        const orderPayload = mongoose.model('order', orderSchema)
        const result = await orderPayload.find({}).sort({ _id: -1 })   // newest first
        response.json(result)
    } catch (err) {
        console.error('Error fetching orders:', err.message)
        response.status(500).json({ error: err.message })
    }
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)