const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  //`mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`
  `mongodb+srv://12345ABCDe:${password}@cluster0.wxowi.mongodb.net/products?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const productSchema = new mongoose.Schema({
  title: String,
  category: String,
  available: Boolean,
})

const Product = mongoose.model('Product', productSchema)

//Find data from MongoDB
Product.find({ available: true }).then(result => {
  result.forEach(product => {
    console.log(product)
  })
  mongoose.connection.close()
})