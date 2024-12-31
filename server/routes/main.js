const express = require( 'express' )
const router = express.Router()
const Post = require( '../models/post' )


/* HOME - GET METHOD  */

router.get( '', async ( request, response ) => {
    try {
        const record = {
            title: "Node js Blog",
            description: "This is the index of the blog"
        }

        let perPage = 3;
        let page = request.query.page || 1;

        const data = await Post.aggregate( [ { $sort: { createdAt: -1 } } ] )
        .skip( perPage * page - perPage )
        .limit( perPage )
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt( page ) + 1;
        const hasNextPage = nextPage <= Math.ceil( count / perPage )

        response.render( 'index', { 
            record,
            data,
            current: page, 
            nextPage: hasNextPage ? nextPage : null
         } );
    
        //const data = await Post.find()
        //response.render( 'index', { record, data } )
    } catch( error ) {
        console.log( error, ' at home - get method' )
    }

    
} )


/** HOME - POST_ID */

router.get( '/post/:id', async ( request, response ) => {
    try {
        let slug = request.params.id;
        const data = await Post.findById( { _id: slug } )

        const record = {
            title: data.title,
            description: "This is the index of the blog"
        }
        

        response.render( 'post', { record, data } )
    } catch( error ) {
        console.log( error, ' at home - get method' )
    }

    
} )


/** POST - SEARCH  */

router.post( '/search', async ( request, response ) => {
    try {
        const record = {
            title: "Search",
            description: "This is the index of the blog"
        }
        
        let searchTerm = request.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace( /[^a-zA-Z0-9 ]/g, " " )

        const data = await Post.find( {
            $or: [ 
                { title: { $regex: new RegExp( searchNoSpecialChar, 'i' ) } },
                { body: { $regex: new RegExp( searchNoSpecialChar, 'i' ) } }
             ]
        } )
        response.render( "search", { 
            data,
            record
         } );
    } catch( error ) {
        console.log( error, ' at home - get method' )
    }

    
} )

/**router.get( '', async ( request, response ) => {
    const record = {
        title: "Node js Blog",
        description: "This is the index of the blog"
    }

    try {
        const data = await Post.find()
        response.render( 'index', { record, data } )
    } catch( error ) {
        console.log( error, ' at home - get method' )
    }

    
} )
 */



/* ABOUT - GET METHOD  */

router.get( '/about', ( request, response ) => {
    const record = {
        title: "Node js Blog",
        description: "This is where u can find about"
    }

    response.render( 'about', { record } )
} )


/** CONTACT - GET METHOD  */

router.get( '/contact', ( request, response ) => {
    const record = {
        title: "Contact Section of the Blog",
        description: "This is where the contact info is"
    }

    response.render( 'contact', { record } )
} )


/**
 * function insertPostData() {
    Post.insertMany( [ 
        {
            title: "The title of the post",
            body: "This is the body of the post"
        },
        {
            title: "The title of the post",
            body: "This is the body of the post"
        },
        {
            title: "The title of the post",
            body: "This is the body of the post"
        },
        {
            title: "The title of the post",
            body: "This is the body of the post"
        },
     ] )
}
insertPostData()

 * 
 */

module.exports = router