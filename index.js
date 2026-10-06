require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const resolve = require('./middleware/response')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ limit: '500mb' }))
app.use(express.urlencoded({ extended: true, limit: '500mb' }))

app.get('/health', (req, res) => {
   const connected = mongoose.connection.readyState === 1
   res.status(connected ? 200 : 503).json({
      success: connected,
      database: connected ? 'connected' : 'disconnected',
   })
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/private', require('./routes/private'))
app.use('/api/banks', require('./routes/banks'))
app.use('/api/lenders', require('./routes/lenders.js'))
app.use(resolve.error)

const startServer = () => {
   app.listen(PORT, '0.0.0.0', () => {
      console.log('listening on port', PORT)
   })
}

const connectDatabase = async () => {
   try {
      if (!process.env.MONGO_URI) {
         throw new Error('MONGO_URI is not configured')
      }

      await mongoose.connect(process.env.MONGO_URI, {
         serverSelectionTimeoutMS: 10000,
      })

      console.log('MongoDB connected')
   } catch (err) {
      console.error('MongoDB connection failed:', err.message)
      console.error('The API will stay online, but database routes will fail until MongoDB is reachable.')
   }
}

mongoose.connection.on('connected', () => {
   console.log('MongoDB connection established')
})

mongoose.connection.on('disconnected', () => {
   console.error('MongoDB disconnected')
})

startServer()
connectDatabase()