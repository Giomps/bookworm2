let mongoose = require('mongoose')

let clientSchema = mongoose.Schema({
    nom: String,
    prenom: String,
    gender: String,
    address: String,
    email: String,
    password: String
});

let clientModel = mongoose.model('Client', clientSchema)
module.exports = clientModel

