const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
require('dotenv').config()

const bcryptSaltRound = 10

app.use(express.json())
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }))

// --- Single source of truth for the connection string ---
const uri = process.env.MONGODB_URI

// --- Schemas (declared once) ---
const lineItem = new mongoose.Schema({
    itemID: String,
    name: String,
    qty: Number,
    price: Number,
})

const orderSchema = new mongoose.Schema({
    customerName: String,
    address: String,
    orderID: String,
    orderStatus: { type: String, default: 'Order Submitted' },
    totalCost: Number,
    lineItems: [lineItem],
})

const fruitSchema = new mongoose.Schema({
    itemID: Number,
    name: String,
    count: Number,
    price: Number,
    icon: String,
    color: String,
})

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
})

// --- Models (registered once, reused everywhere — fixes the OverwriteModelError risk too) ---
const Order = mongoose.model('order', orderSchema)
const Inventory = mongoose.model('inventory', fruitSchema, 'inventory')
const User = mongoose.model('users', userSchema, 'users')

// --- Connect once, at startup ---
mongoose.set('strictQuery', false)
mongoose.connect(uri, { family: 4 })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Connection failed:', err.message))

// --- Routes ---

app.post('/api/submitOrder', async (request, response) => {
    const order = request.body

    try {
        let totalCost = 0
        order.lineItems.forEach((element) => {
            totalCost += element.qty * element.price
        })

        const uniqueID = `ORD-${Math.floor(Math.random() * 900000 + 100000)}`

        const newOrder = new Order({
            customerName: order.customerName,
            address: order.address,
            orderID: uniqueID,
            totalCost: totalCost,
            lineItems: order.lineItems,
        })

        const saved = await newOrder.save()
        response.json(saved)
    } catch (err) {
        response.status(400).json({ error: err.message })
    }
})

orderSchema.post('save', async function updateInventory(doc) {
    try {
        for (const element of doc.lineItems) {
            await Inventory.updateOne(
                { itemID: Number(element.itemID) },
                { $inc: { count: -element.qty } }
            )
        }
    } catch (err) {
        console.log('failed to update inventory after order save:', err)
    }
})

app.get('/api/getInventory', async (request, response) => {
    try {
        const result = await Inventory.find({})
        response.json(result)
    } catch (err) {
        response.status(500).json({ error: err.message })
    }
})

app.get('/api/getInventoryCustomer', async (request, response) => {
    try {
        const result = await Inventory.find({ count: { $gt: 0 } })
        response.json(result)
    } catch (err) {
        response.status(500).json({ error: err.message })
    }
})

app.post('/api/login', async (request, response) => {
    try {
        const { email, password } = request.body

        const user = await User.findOne({ email })
        if (!user) {
            return response.status(401).json({ success: false, error: 'Invalid email or password' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return response.status(401).json({ success: false, error: 'Invalid email or password' })
        }

        response.json({ success: true })
    } catch (err) {
        console.error('Login error:', err.message)
        response.status(500).json({ success: false, error: err.message })
    }
})

app.get('/api/getAllOrders', async (request, response) => {
    try {
        const result = await Order.find({}).sort({ _id: -1 })
        response.json(result)
    } catch (err) {
        console.error('Error fetching orders:', err.message)
        response.status(500).json({ error: err.message })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)