let mongoose  = require('mongoose')


// Schema d'un produit
let productsSchema = mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    img: String
})

let productsModel = mongoose.model('products', productsSchema)
module.exports = productsModel