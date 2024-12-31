const express = require( 'express' )
const router = express.Router()
const Post = require( '../models/post' )
const User = require( '../models/user' )
const bcrypt = require( 'bcrypt' )
const jwt = require( 'jsonwebtoken' )

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET


//password

/** CHECK LOGIN   */

const authMiddleware = ( request, response, next ) => {
    const token = request.cookies.token

    if( !token ) {
        return response.status( 401 ).json( { message: 'Unauthorized' } )
    } 

    try {
        const decoded = jwt.verify( token, jwtSecret )
        require.userId = decoded.userId
        next();
    } catch( error ) {
        return response.status( 401 ).json( { message: 'Unauthorized' } )
    }
}




/**GET - ADMIN_LOGIN-PAGE */

router.get( '/admin', async ( request, response ) => {
    try {
        const record = {
            title: "Admin",
            description: "This is the Admin section of the blog"
        }

        response.render( 'admin/index', { record, layout: adminLayout } )
    } catch( error ) {
        console.log( error, ' at home - get method' )
    } 
} )

/** POST - ADMIN_CHECK-LOGIN */

router.post( '/admin', async ( request, response ) => {
    try {
        const record = {
            title: "Admin",
            description: "This is the Admin section of the blog"
        }

        const { username, password } = request.body;
        
        const user = await User.findOne( { username } );
        const data = await Post.find();

        if( !user ) {
            return response.status( 401 ).json( { message: 'Invalid credentials' } )
        }

        const isPasswordValid = await bcrypt.compare( password, user.password );

        if( !isPasswordValid ) {
            return response.status( 401 ).json( { message: 'Invalid credentials' } )
        }

        const token = jwt.sign( { userId: user._id }, jwtSecret );
        response.cookie( 'token', token, { httpOnly: true } );

        response.render( 'admin/dashboard', { record, layout: adminLayout, data } )

    } catch( error ) {
        console.log( error, ' at admin - post method' )
    } 
} )


/** GET - DASHBOARD */
router.get( '/admin/dashboard', authMiddleware, async ( require, response ) => {
    try {
        const record = {
            title: "DashBoard",
            description: "This is the Dashboard of the blog"
        }
        const data = await Post.find();
        response.render( 'admin/dashboard', { 
            record, 
            layout: adminLayout,
            data
         } )
    }catch( error ) {
        console.log( error )
    }
} )


/** GET - ADMIN CREATE POST  */
router.get( '/add-post', authMiddleware, async ( require, response ) => {
    try {
        const record = {
            title: 'Create New Post',
            description: 'Where one can create new posts'
        }
        const data = await Post.find()
        response.render( 'admin/add-post', {
            record,
            data,
            layout: adminLayout
        } )
    } catch( error ){
        console.log( error )
    }
} )


/** POST - ADMIN CREATE POST  */
router.post( '/add-post', authMiddleware, async ( request, response ) => {
    try {
        console.log( request.body )
        try{    
            const newPost = new Post( {
                title: request.body.title,
                body: request.body.body
            } )

            await Post.create( newPost )

            response.redirect( 'admin/dashboard' )
        } catch( error ){
            console.log( error )
        }   
        

    } catch( error ){
        console.log( error )
    }
} )


// GET - ADMIN EDIT
router.get( '/edit-post/:id', authMiddleware, async ( request, response ) => {
    try {
        const record = {
            title: 'Edit Post',
            description: 'Where one can edit posts'
        }
        
        const data = await Post.findOne( { _id: request.params.id } )


        response.render( 'admin/edit-post', {
            data,
            record,
            layout: adminLayout
        } )

    } catch( error ){
        console.log( error )
    }
} )



/** PUT - ADMIN EDIT  */
router.put( '/edit-post/:id', authMiddleware, async ( request, response ) => {
    try {
        
        await Post.findByIdAndUpdate( request.params.id, {
            title: request.body.title,
            body: request.body.body,
            updatedAt: Date.now()
        } )

        response.redirect( `/edit-post/${ request.params.id }` )

    } catch( error ){
        console.log( error )
    }
} )


// DELETE - ADMIN 
router.delete( '/delete-post/:id', authMiddleware, async ( request, response ) => {
    try{
    
        await Post.deleteOne( { _id: request.params.id } )

        response.redirect( '../admin/dashboard' )
    }catch( error ){
        console.log( error )
    }

})


/** POST - REGISTER_CHECK-LOGIN 

router.post( '/register', async ( request, response ) => {
    try {
        const { username, password } = request.body;
        const hashedPassword = await bcrypt.hash( password, 10 )

        try {
            const user = await User.create( { username, password: hashedPassword } )
            response.status( 201 ).json( { message: 'User created ', user  } )

        } catch( error ) { 
            console.log( error, ' at - POST /register ' )
            if( error.code === 11000 ){
                response.status( 409 ).json( { message: 'User already in use' } )
            }
            response.status( 500 ).json( { message: 'Internal server error' } )
        }

    } catch( error ) {
        console.log( error, ' at Register - post method' )
    } 
} )
*/

// GET - ADMIN LOGOUT
router.get( '/logout', ( request, response ) => {
    response.clearCookie( 'token' )
    response.redirect( '../' )
} )


module.exports = router