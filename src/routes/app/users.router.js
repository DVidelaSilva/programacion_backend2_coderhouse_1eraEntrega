const { Router } = require('express')

const { userModel } = require('../../daos/models/users.model')
const { createHash } = require('../../utils/hash')
const { UserDaoMongo } = require('../../daos/mongo/user.dao.mongo')

const usersService = new UserDaoMongo()

const router = Router()



//* TRAER TODOS LOS USUARIOS
router.get('/', async (req, res) => {
    try{    
        const users = await usersService.getUsers()

        //!Validaciones
        if(users.length == 0){
            return res.status(404).send({status: 'error', error: 'No existen usuarios registrados'})
        }
        //!

        res.status(200).send({status: 'success', message: 'Listado de Usuarios', data: users})
        
    } catch (error){
        console.log(error);
    }
})



//* TRAER USUARIO POR ID
router.get('/:uid', async (req, res) => {
    try{

        const { uid } = req.params
        const user = await usersService.getUser({_id: uid})

        //!Validaciones
        if(!user){
            return res.status(404).send({status: 'error', error: 'El usuario buscado no existe'})
        }
        //!

        res.status(200).send({status: 'success', message: 'Usuario Buscado', data: user})

    } catch (error) {
        console.log(error);
    }
})



//* CREAR UN USUARIO
router.post('/', async (req, res) => {
    try{
        const {first_name, last_name, email, age, password} = req.body

        //!Validaciones
        if(!first_name || !last_name || !email || !password ) {
            return res.status(400).send({status: 'error', error: 'Faltan llenar campos'})
        }
        if(age !== undefined) {
            if(typeof age !== 'number'){
              return res.status(400).send({status: 'error', error: 'Debes ingresar una edad valida'})      
            }
            if (age <= 0){
            return res.status(400).send({status: 'error', error: 'La edad debe ser mayor a cero'})
           }
        }
        const existUser = await usersService.getUser({email})
        if (existUser){
            return res.status(400).send({status: 'error', error: `El usuario email <${email}>, ya se encuentra registrado`})
        }
        //!

        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        }
        const result = await usersService.createUser(newUser)
        res.status(201).send({status: 'success', message: 'Usuario creado exitosamente', data: result})

    } catch (error) {
        console.log(error);
    }

}) 


//* ACTUALIZAR INFO DE UN USUARIO
router.put('/:uid', async (req, res) => {
    try{
      const { uid } = req.params
        const { first_name, last_name, email, age } = req.body

        //!Validaciones
        const existUser = await usersService.getUser({_id:uid})
        if (!existUser){
            return res.status(400).send({status: 'error', error: `Usuario no encontrado`})
        }
        if(!email) {
            return res.status(400).send({status: 'error', error: 'Debes ingresar el email para actualizar'})
        }
        if(age !== undefined) {
            if(typeof age !== 'number'){
              return res.status(400).send({status: 'error', error: 'Debes ingresar una edad valida'})      
            }
            if (age <= 0){
            return res.status(400).send({status: 'error', error: 'La edad debe ser mayor a cero'})
           }
        }
        //!

        const userToUpdate = {
            first_name,
            last_name,
            email,
            age
        }
        const result = await usersService.updateUser({_id:uid}, userToUpdate)
        const updateResult = await usersService.getUser({_id:uid})
        res.status(201).send({status: 'success', message: 'Datos de Usuario Actualizados exitosamente', data: updateResult})

    } catch (error) {
        console.log(error);
    }
})


//* ACTUALIZAR ROLE DE UN USUARIO
router.put('/update/role', async (req, res) => {
    try{
        const { email, newRole } = req.body
        console.log(email, newRole);

        //! Validaciones
        if(!email || !newRole) {
            return res.status(400).send({status: 'error', error: 'Debes ingresar el email y role para actualizar'})
        }
        const existUser = await usersService.getUser({email})
        if (!existUser){
            return res.status(400).send({status: 'error', error: `Usuario no encontrado`})
        }
        if(newRole !== 'user' && newRole !== 'user-premium' && newRole !== 'admin'){
            return res.status(400).send({status: 'error', error: 'El role ingresado no es valido'})
        }

        //!

        const result = await usersService.updateRoleUser(email, newRole)
        res.status(201).send({status: 'success', message: 'Role de Usuario Actualizado exitosamente', data: result})

    } catch (error) {
        console.log(error);
    }
})


//* ELIMINAR UN USUARIO
router.delete('/:uid', async (req, res) => {

    try{
        const { uid } = req.params

        //!Validaciones
        const existUser = await usersService.getUser({_id:uid})
        if (!existUser){
            return res.status(400).send({status: 'error', error: `Usuario no encontrado`})
        }
        //!

        const result = await usersService.deleteUser({_id:uid})
        res.status(200).send({status: 'success', message: 'Usuario Eliminado exitosamente'})
    } catch (error) {
        console.log(error);
    }
})







module.exports = router