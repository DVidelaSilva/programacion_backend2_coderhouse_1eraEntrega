const { Router } = require('express')

const viewsRouter = require('./app/views.router')
const userRouter = require('./app/users.router')
const sessionsRouter = require('./app/session.router') 

const router = Router()


router.use('/', viewsRouter)
router.use('/api/users', userRouter)
router.use('/api/sessions', sessionsRouter)



module.exports = router