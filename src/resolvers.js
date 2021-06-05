require('dotenv').config();
import { AddReview } from './resolvers/addReview';
import { AddUser } from './resolvers/AddUser';
import { GetProductDetail } from './resolvers/getProductDetail';
import { InvalidateToken } from './resolvers/invalidateToken';
import { IsAuthenticated } from './resolvers/isAuthenticated';
import { LoginUser } from './resolvers/loginUser';
import { GetUser } from './resolvers/getUser';
import { User, Product } from './models/models';

export const resolvers = {
    Query: {
        getUsers: async (_, __, { req }) => await GetUser(req.userId),
        getShopList: async () => await Product.find({}).exec(),
        isAuthenticated: async (_, __, { req }) => await IsAuthenticated({ req: req }),
        getProductDetail: async (_, { productId }, { req }) => await GetProductDetail({ productId: productId, req: req }),
    },
    Mutation: {
        addUser: async (_, args) => await AddUser(args),
        loginUser: async (_, args, { res }) => {
            console.log("here")
            return await LoginUser({ ...args, res: res })
        },
        invalidateToken: async (_, __, { req, res }) => await InvalidateToken({ req: req, res: res }),
        addReview: async (_, { review, productId, stars, reviewId }, { req }) => await AddReview({
            review: review,
            productId: productId,
            stars: stars,
            reviewId: reviewId,
            req: req
        })
    }
};
