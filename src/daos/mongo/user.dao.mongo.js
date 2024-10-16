const { userModel } = require('../models/users.model')


//? CRUD a BD MongoDB

class UserDaoMongo {

    constructor(){
        this.model = userModel
    }

    //* OBTENER UN USUARIO
    getUser = async filter => {
        console.log(filter);
        return await this.model.findOne(filter)
    }

    //* CREAR UN USUARIO
    createUser = async newUser => {
        return await this.model.create(newUser)
    }

    //* OBTENER TODOS LOS USUARIOS
    getUsers = async () => {
        return await this.model.find()
    }

    //* ACTUALIZAR UN USUARIO
    updateUser = async (filter, updateData) => {
        return await this.model.findByIdAndUpdate(filter, updateData)
    }

    //* ACTUALIZAR ROLE DE UN USUARIO
    updateRoleUser = async (email, newRole) => {
        return await this.model.findOneAndUpdate({email}, {role: newRole}, {new: true})
    }

    //* ELIMINAR UN USUARIO
    deleteUser = async (filter) => {
        return await this.model.findByIdAndDelete(filter)
    }

}


module.exports = {
    UserDaoMongo
}
