const mongoose = require( 'mongoose' )
const connectDB = async () => {

    try {
        mongoose.set( 'strictQuery', false )
        const conn = await mongoose.connect( process.env.MONGODB_URL )
        console.log( 'Data base connected' )
    } catch( error ) {
        console.log( error, ' at connecting database' )
    }
}

module.exports = connectDB