import { User, Product } from './models/models';
import hash from 'object-hash';

export const resolvers = {
    Query: {
        getUsers: async () => await User.find({}).exec(),
        getShopList: async () => await Product.find({}).exec()
    },
    Mutation: {
        addUser: async (_, args) => {
            try {
                const { userName, password } = args
                const exist = () => {
                    User.exists({userName: userName}, (err, doc) => {
                    if (err) {
                        console.log(err)
                    }
                    return doc
                })};
                if (exist) throw new Error("User already exit");
                const hashed_password = hash(password)
                let response = User.create({userName: userName, password: hashed_password});
                return response;
                
            } catch(e) {
                console.log("thrown ",e.message)
                return e.message;
            }
        },
        

    }
};
