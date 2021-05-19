import { User, Product } from './models/models';

export const resolvers = {
    Query: {
        getUsers: async () => await User.find({}).exec(),
        getShopList: async () => await Product.find({}).exec()
    },
    Mutation: {
        addUser: async (_, args) => {
            try {
                let response = await User.create(args);
                return response;
            } catch(e) {
                return e.message;
            }
        },

    }
};
