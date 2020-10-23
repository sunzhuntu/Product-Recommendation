const mongoose = require('mongoose')

//const url = process.env.MONGODB_URI
const url =
  //`mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`
  `mongodb+srv://12345ABCDe:12345ABCDe@cluster0.wxowi.mongodb.net/products?retryWrites=true&w=majority`


console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    required: true
  },
  category: {
    type: String,
    minlength: 2,
    required: true
  },
  available: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Product', productSchema)