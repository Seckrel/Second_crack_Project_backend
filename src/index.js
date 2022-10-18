import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./models/models";
import { createTokens } from "./auth";
require("dotenv").config();
import cors from "cors";
const stripe = require("stripe")(
  "sk_test_51Lu4qoISTY11cqSycaCLBcip7edHZN2fqN8AhoGJpqVEcmtbMmfFKUyCsWyNMXiC6wWzXjkYvi812yXSbzvkkLqe00pmeD4lrR"
);
const uuid = require("uuid").v4;

const PORT = 4000;

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: [
    "Content-Type",
    "Content-Length",
    "Authorization",
    "Accept",
    "X-Requested-With",
    "x-access-token",
  ],
};

const startServer = async () => {
  const app = express();

  await require("./config");
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
  });

  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(async (req, res, next) => {
    const accessToken = req.cookies["access-token"];
    const refreshToken = req.cookies["refresh-token"];
    if (refreshToken) {
      try {
        const data = verify(accessToken, process.env.ACCESS_TOKEN);
        req.userId = data.userId;
        return next();
      } catch (e) {
        console.log(new Date().toLocaleTimeString(), e.message);
      }
      if (!refreshToken) return next();
      try {
        const data = verify(refreshToken, process.env.REFRESH_TOKEN);
        const user = await User.findById(data.userId);
        if (!user || user.count !== data.count) return next();
        const tokens = createTokens(user);
        res.cookie("access-token", tokens.accessToken, {
          maxAge: 60 * 1000,
          httpOnly: true,
        });
        req.userId = data.userId;
      } catch (e) {
        console.log(new Date().toLocaleTimeString(), e.message);
        return next();
      }
    }
    next();
  });
  server.applyMiddleware({ app });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.post("/checkout", async (req, res) => {
    let error;
    let status;
    console.log("working");
    try {
      const {product, token} = req.body;
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id
      })
      const idempotency_key = uuid();
      const charge = await stripe.charges.create({
        amount: 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchase`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
        }
      }, {
        idempotency_key
      });
      console.log("Charges", {charge});
      status="success";
    }catch (error){
      console.error("Error", error)
      status = "faliure"
    }
    res.json({error, status});
  })
  app.listen(PORT, () =>
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  );
};

startServer();
