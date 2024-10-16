const { connect } = require('mongoose')

const uri = 'mongodb+srv://DAVS_CoderHouse_Backend:davs1509@cluster0.wtz9xqt.mongodb.net/HBS_B2_primeraEntrega?retryWrites=true&w=majority&appName=Cluster0'

const connectDB = async () => {
    console.log('Conexion a MongoAlas Exitosa');
    await connect(uri)
}


module.exports = {
    connectDB
}