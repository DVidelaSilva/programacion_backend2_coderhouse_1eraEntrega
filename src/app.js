//? Importaciones de Dependencias
const express = require('express')
const handlebars = require('express-handlebars')
const { connectDB } = require('./config/mongoDB')
const cookieParser = require('cookie-parser')

//? Importaciones Internas
const appRouter = require('./routes/index')
const { initializePassport } = require('./config/passport.config')
const passport = require('passport')


//? Servidor Express
const app = express()
const PORT = 8080


//? middlewares de Express
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))
app.use(cookieParser('palabrasecreta'))


//? Conectar con MongoAtlas
connectDB()


//? Configuraciones Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')



//? Passport JWT
initializePassport()
app.use(passport.initialize())


//? Inicializar Rutas
app.use(appRouter)





//? Escucha de Servidor
app.listen(PORT, error => {
    if(error){
        console.error(`Error al iniciar el servidor: ${error.message}`);
        return
    }
    console.log(`Servidor escuchando en puerto: ${PORT}`);
})