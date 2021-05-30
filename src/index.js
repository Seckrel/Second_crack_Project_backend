import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers'
import cookieParser from 'cookie-parser';
import { verify, sign } from 'jsonwebtoken'; 
import { User } from './models/models';
import { createTokens } from './auth';
require('dotenv').config()


// const myGraphQLSchema = // ... define or import your schema here!
const PORT = 4000;


const startServer = async () => {
    const app = express();

   await require('./config');
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => ({ req, res })
    })
    app.use(cookieParser());
    app.use(async (req, res, next) => {
        const accessToken = req.cookies['access-token'];
        const refreshToken = req.cookies['refresh-token'];
        if (refreshToken){
            try{
            const data = verify(accessToken, process.env.ACCESS_TOKEN)
            req.userId = data.userId
            return next()
            }catch (e){
                console.log("line 33 @ index.js:", e.message)
            }
            if (!refreshToken) return next();
            console.log("here")
            try{
                const data = verify(refreshToken, process.env.REFRESH_TOKEN);
                const user = await User.findById(data.userId);
                if(!user || user.count !== data.count) return next();
                const tokens = createTokens(user);
                res.cookie('access-token', tokens.accessToken, { maxAge: 60 * 1000, httpOnly: true });
            }catch(e){
                console.log("line 46 @ index.js:",e.message)
                return next();
            }          
        }
        next();
    })
    server.applyMiddleware({ app })

    // bodyParser is needed just for POST.
    // app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: myGraphQLSchema }));

    app.listen(PORT, () =>
        console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    );
}

startServer();