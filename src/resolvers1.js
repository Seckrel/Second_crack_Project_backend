require('dotenv').config();
import { User, Product, Reviews } from './models/models';
import hash from 'object-hash';
import { createTokens } from './auth';

export const resolvers = {
    Query: {
        getUsers: async () => await User.find({}).exec(),
        getShopList: async () => await Product.find({}).exec(),
        isAuthenticated: async (_, __, { req }) => {
            if (!req.userId) return false;
            const user = await User.findById(req.userId).exec();
            if (!user) return false;
            return true;
        },
        getProductDetail: async (_, { productId }) => {
            const product = await Product.findById(productId).populate({
                path: '_reviewId',
                populate: {
                    path: '_userId',
                    model: 'user'
                }
            })
            return product
        },
    },
    Mutation: {
        addUser: async (_, args) => {
            try {
                const { userName, password } = args
                const exist = await User.exists({userName: userName})
                if (exist) throw new Error("User already exit");
                const hashed_password = hash(password)
                let response = User.create({userName: userName, password: hashed_password});
                return response;
                
            } catch(e) {
                console.error("Adding new User ",e.message)
                return e.message;
            }
        },
        loginUser: async (_, { userName, password }, { res }) => {
            try {
                const user = await User.findOne({ userName: userName })

                if (!user) return null;

                const checkPassword = hash(password) === user.password;
                
                if (!checkPassword) return null;

                const { refreshToken, accessToken } = createTokens(user)
                res.cookie('access-token', accessToken, { maxAge: 60 * 1000, httpOnly: true });
                res.cookie('refresh-token', refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
                return user;
            }catch (err){
                console.log(err);
            }
        },
        invalidateToken: async (_, __, { req, res }) => {
            if (!req.userId) return false;
            const user = await User.findById(req.userId);
            if (!user) return false;
            user.count += 1;
            await user.save();
            res.clearCookie('access-token');
            res.clearCookie('refresh-token');
            return true;
        },
        addReview: async (_, { review, productId, stars }, { req} ) => {
            try {
                if (!req.userId) return null;
                const alreadyReviewedByUser = await Reviews.find({ _productId: productId, _userId: req.userId });
                if (alreadyReviewedByUser) return null;
                const response = await Reviews.create({review: review, _productId: productId, _userId: req.userId ,stars: stars });
                Product.findByIdAndUpdate(
                    productId,
                    {runValidators: true},
                    (err, doc) => {
                        if (err) throw new Error(err);
                        doc._reviewId.push(response._id)
                        doc.save()
                    }
                )
                return response;
            }catch(e) {console.log(e.message)}
        }
    }
};
