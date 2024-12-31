require( 'dotenv' ).config()

const express = require( 'express' )
const expressLayot = require( 'express-ejs-layouts' )
const methodOverride = require( 'method-override' )
const cookieParser = require( 'cookie-parser' )
const mongoStore = require( 'connect-mongo' )
const session = require( 'express-session' )

const connectDB = require( './server/config/data_base' )

const app = express()
const PORT = 8888 || process.env.PORT

connectDB()

app.use( express.urlencoded( { extended: true } ) );
app.use( express.json() );
app.use( cookieParser() );
app.use( methodOverride( '_method' ) );

app.use( session ( {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create( {
        mongoUrl: process.env.MONGODB_URL
    } )
} ) )


app.use( express.static( 'static' ) )

// Template 
app.use( expressLayot )
app.set( 'layout', './layouts/main' )
app.set( 'view engine', 'ejs' )

app.use( '/', require( './server/routes/main' ) )
app.use( '/', require( './server/routes/admin' ) )

app.listen( PORT, () => {
    console.log( 'server started' )
} )