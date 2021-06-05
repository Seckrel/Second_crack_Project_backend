import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers'
import cookieParser from 'cookie-parser';
import { verify } from 'jsonwebtoken';
import { User } from './models/models';
import { createTokens } from './auth';
require('dotenv').config()
import cors from 'cors'

const PORT = 4000;

const corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    allowedHeaders: ['Content-Type', 'Content-Length', 'Authorization', 'Accept', 'X-Requested-With', 'x-access-token']

}

const startServer = async () => {
    const app = express();

    await require('./config');
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => ({ req, res })
    })
    app.use(cors(corsOptions))
    app.use(cookieParser());
    app.use(async (req, res, next) => {
        const accessToken = req.cookies['access-token'];
        const refreshToken = req.cookies['refresh-token'];
        if (refreshToken) {
            try {
                const data = verify(accessToken, process.env.ACCESS_TOKEN)
                req.userId = data.userId
                return next()
            } catch (e) {
                console.log("line 33 @ index.js:", e.message)
            }
            if (!refreshToken) return next();
            try {
                const data = verify(refreshToken, process.env.REFRESH_TOKEN);
                const user = await User.findById(data.userId);
                if (!user || user.count !== data.count) return next();
                const tokens = createTokens(user);
                res.cookie('access-token', tokens.accessToken, { maxAge: 60 * 1000, httpOnly: true });
                req.userId = data.userId;
            } catch (e) {
                console.log("line 46 @ index.js:", e.message)
                return next();
            }
        }
        next();
    })
    server.applyMiddleware({ app })

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json())

    app.listen(PORT, () =>
        console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    );
}

startServer();