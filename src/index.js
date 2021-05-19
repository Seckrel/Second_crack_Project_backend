import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers'
const passport = require('passport');
const cookieSession = require('cookie-session')
require('./passport-setup');

// const myGraphQLSchema = // ... define or import your schema here!
const PORT = 4000;


const startServer = async () => {
    const app = express();
    app.use(cookieSession({
        name: 'second_crack',
        keys: ['key1', 'key2']
      }))

    const isLoggedIn = (req, res, next) => {
        if (req.user){
            next();
        }else{
            res.sendStatus(401);
        }
    }
      
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/google/failed', (req,res) => res.redirect('/'));
    app.get('/google/success', isLoggedIn, (req, res) => res.send(`Welcome user ${res}`) )
    app.get('/google',
        passport.authenticate('google', { scope: [ 'email', 'profile' ] }
    ));

    app.get( '/google/callback',
        passport.authenticate( 'google', {
        successRedirect: '/google/success',
        failureRedirect: '/google/failure'
    }));
    
    app.get('/logout', (req, res) => {
        req.session = null;
        req.logout();
        console.log("logged out");
    })

   await require('./config');
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    })
    server.applyMiddleware({ app })

    // bodyParser is needed just for POST.
    // app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: myGraphQLSchema }));

    app.listen(PORT, () =>
        console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    );
}

startServer();