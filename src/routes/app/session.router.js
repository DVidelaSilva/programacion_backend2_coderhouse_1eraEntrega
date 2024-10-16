const { Router } = require('express')
const passport = require('passport')

const { createHash, isValidPassword } = require('../../utils/hash')
const { UserDaoMongo } = require('../../daos/mongo/user.dao.mongo')
const { generateToken } = require('../../middlewares/jwt')
const { passportCall } = require('../../middlewares/passport/passportCall.middleware')
const { authorization } = require('../../middlewares/passport/authorization.middleware')


const usersService = new UserDaoMongo()

const router = Router()



//* REGISTRAR UN USUARIO
router.post('/register', async (req, res) => {
    try{
        const {first_name, last_name, email, age, password} = req.body

        //!Validaciones
        if(!first_name || !last_name || !email || !password ) {
            return res.status(400).send({status: 'error', error: 'Faltan llenar campos'})
        }
        let ageNumber = null
        if(age !== undefined && age !== '') {
            ageNumber = parseInt(age, 10)
            if(typeof parseAge !== Number){
                if(isNaN(ageNumber)){
                    return res.status(400).send({status: 'error', error: 'Debes ingresar una edad valida'}) 
                }    
            }
            if (ageNumber <= 0){
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
            age: ageNumber,
            password: createHash(password)
        }
        const result = await usersService.createUser(newUser)
        //res.status(201).send({status: 'success', message: 'Usuario creado exitosamente', data: result})
        console.log({status: 'success', message: 'Usuario creado exitosamente', data: result});

        res.redirect('/successRegister')

    } catch (error) {
        console.log(error);
    }
}) 



//* LOGIN DE USUARIO
router.post('/login', async(req, res) => {

    const { email, password } = req.body
    //if(!email || !password) return res.status(400).send({status: 'success', message: 'deben venir todos los campos requeridos'})
    const userFound = await usersService.getUser({email})

    if (!userFound){
    return res.status(400).send({status: 'error', error: `El usuario email <${email}>, no se encuentra registrado`})
    }

    if (!isValidPassword(password, userFound.password)) return res.send({status: 'error', message: 'las credenciales no coinciden'})

    console.log({status: 'success', message: 'Logged'});
    
    // res.send({
    //     status: 'success',
    //     message: 'Logged'
    // })

    const token = generateToken({id: userFound._id, role: userFound.role})
    
    res.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    })
    // .send({
    //     status: 'success',
    //     data: userFound,
    //     token
    // })

    .redirect('/currentUser')
})


//* LOGIN/REGISTER DE USUARIO POR GITHUB
router.get('/github', passport.authenticate('github', { scope: ['user:email']}), async (req, res) => {})

router.get('/githubcallback', passport.authenticate('github', {session: false}), async (req, res) => {
    const token = generateToken({ id: req.user._id, role: req.user.role });
    
    res.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 24, // 1 día
        httpOnly: true
    });
    
    res.redirect('/currentUser'); // Redirige a donde necesites
});



//* LOGOUT DE USUARIO
router.get('/logout', (req, res) => {
        res.clearCookie('token') // Limpia la cookie del token
        console.log({ status: 'success', message: 'Has cerrado sesión correctamente.' })
        //res.send({ status: 'success', message: 'Has cerrado sesión correctamente.' });
        res.redirect('/')
})



//* PORTAL USUARIO -> USER
router.get('/currentUser', passportCall('jwt'), (req, res) => {
    //res.send({dataUser: req.user, message: 'datos sensibles'})
    console.log({dataUser: req.user, message: 'datos sensibles user'})
    res.redirect('/currentUser')
})


//* PORTAL USUARIO -> USER-PREMIUM
router.get('/currentUserPremium', passportCall('jwt'),authorization('user-premium'), (req, res) => {
    //res.send({dataUser: req.user, message: 'datos sensibles'})
    console.log({dataUser: req.user, message: 'datos sensibles user-premium'})
    res.redirect('/currentUserPremium')
})


//* PORTAL USUARIO -> ADMIN
router.get('/currentAdmin', passportCall('jwt'),authorization('admin'), (req, res) => {
    //res.send({dataUser: req.user, message: 'datos sensibles'})
    res.redirect('/currentAdmin')
    console.log({dataUser: req.user, message: 'datos sensibles'});
})


// router.get('/userViews', passport.authenticate('jwt', {session: false}), (req, res) => {
//     res.send({dataUser: req.user, message: 'datos sensibles'})
// })


module.exports = router