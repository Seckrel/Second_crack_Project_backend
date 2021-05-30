import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers'
require('dotenv').config()
const passport = require('passport');
const cookieSession = require('cookie-session')

// const myGraphQLSchema = // ... define or import your schema here!
const PORT = 4000;


const startServer = async () => {
    const app = express();

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