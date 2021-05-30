import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers'
import cookieParser from 'cookie-parser';
import { verify, sign } from 'jsonwebtoken'; 
import { User } from './models/models';
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
        if (accessToken && refreshToken){
            try{
            const data = verify(accessToken, process.env.ACCESS_TOKEN)
            req.userId = data.userId
            return next()
            }catch (e){
                console.log("line 33 @ index.js:", e.message)
            }
            if (!refreshToken) return next();
            
            try{
                const data = verify(refreshToken, process.env.REFRESH_TOKEN);
                console.log("data", data)
                const user = await User.findById(data.userId);
                if(!user) return next();
                const NewAccessToken = sign({ userId: user._id}, process.env.ACCESS_TOKEN, {
                    expiresIn: '1min'
                })
                res.cookie('access-token', NewAccessToken);
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