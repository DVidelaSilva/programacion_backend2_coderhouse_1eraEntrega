const { Schema, model } = require('mongoose')

// Coleccion en la que guardare los documentos
const userCollection = 'users'

// Definicion del esquema de los documentos

const userSchema = new Schema( {

    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    age: {
        type: Number,
    },
    password: {
        type: String,
        require: true
    },
    cartID: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        enum: ['user', 'user-premium', 'admin'],
        default: 'user'
    }

})



const userModel = model(userCollection, userSchema)

module.exports = {
    userModel
}