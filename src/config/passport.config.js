const passport = require('passport')
const jwt = require('passport-jwt')
const GithubStrategy = require('passport-github2')


const { UserDaoMongo } = require('../daos/mongo/user.dao.mongo')
const { PRIVATE_KEY } = require('../middlewares/jwt')
const { createHash } = require('../utils/hash')

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt
const usersService = new UserDaoMongo()

const initializePassport = () => {

    // funcion para extraer el token de las cookies (en el request)
    const cookeExtractor = req => { 
        let token = null
        if(req && req.cookies){
            token = req.cookies['token']
        }
        return token
    }

//? ESTRATEGIA JWT
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookeExtractor]), // Metodo que desencripta el Token 
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {  //jwt_payload trae los datos desencriptados del jwt
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
}

//? ESTRATEGIA GITHUB
    passport.use( "github", new GithubStrategy(
        {
          clientID: "Iv23licICo5tWnGju0Nd",
          clientSecret: "37e5b083c028f06b0bfdc7df6e572bbb7ad99d52",
          callbackURL: "http://localhost:8080/api/sessions/githubcallback",
        },
        async (accesToken, refreshToken, profile, done) => {
          try {
            console.log(profile);
            let user = await usersService.getUser({email: profile._json.email})

            if(!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    email: profile._json.email,
                    password: createHash('123456')
                }
                let result = await usersService.createUser(newUser);
                return done(null, result)
            }
            done(null, user)
          } catch (error) {
            return done(error);
          }
        }
      )
    )


module.exports = {
    initializePassport
}



