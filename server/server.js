require('dotenv').config()
const jwt = require('jsonwebtoken')

const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

const Product = require('../models/product')
const User = require('../models/user')


const loginRouter = require('../controllers/login')
app.use('/api/login', loginRouter)

const usersRouter = require('../controllers/users')
app.use('/api/users', usersRouter)

const RecommendationRouter = require('../controllers/recommendation')
app.use('/api/Recommendation', RecommendationRouter)

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}


app.get('/', (request, response) => {
  response.send('<h1> this is a web server </h1>')
})

app.get('/api/products', (request, response) => {
  Product.find({}).populate('user', { username: 1, name: 1 })
    .then(products => {
      response.json(products)
      console.log('handle http get request')
    })
})

app.get('/api/products/:id', (request, response, next) => {
  Product.findById(request.params.id).then(product => {
    if (product) {
      response.json(product)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/products/:id', (request, response, next) => {
  Product.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/products', async (request, response, next) => {
  const body = request.body
  console.log('handle http post request')
  console.log(body)

  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const product = new Product({
    title: body.title,
    category: body.category,
    available: Math.random > 0.5,
    user: user._id
  })

  product.save().then(savedProduct => {
    user.products = user.products.concat(savedProduct.title)
    user.save()
    response.json(savedProduct.toJSON())
  })
    .catch(error => next(error))
})

app.put('/api/products/:id', (request, response, next) => {
  const body = request.body

  const product = {
    title: body.title,
    category: body.category,
    available: body.available
  }

  Product.findByIdAndUpdate(request.params.id, product, { new: true })
    .then(updatedProduct => {
      response.json(updatedProduct)
    })
    .catch(error => next(error))
})



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }
  next(error)
}

app.use(errorHandler)


const PORT = 3003

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})