const { Router } = require('express')


const router = Router()

router.get('/', (req, res) => {
    res.render('home.handlebars')
}) 

router.get('/register', (req, res) => {
    res.render('register.handlebars')
})

router.get('/successRegister', (req, res) => {
    res.render('successRegister.handlebars')
})

router.get('/login', (req, res) => {
    res.render('login.handlebars')
})

router.get('/products', (req, res) => {
    res.render('products.handlebars')
})

router.get('/currentUser', (req, res) => {
    res.render('viewUser.handlebars')
})

router.get('/currentUserPremium', (req, res) => {
    res.render('viewUserPremium.handlebars')
})

router.get('/currentAdmin', (req, res) => {
    res.render('viewAdmin.handlebars')
})

router.get('/currentAdmin/asignRole', (req, res) => {
    res.render('viewAdmin.asignRole.handlebars')
})



module.exports = router