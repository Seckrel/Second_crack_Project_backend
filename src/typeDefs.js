import { gql } from 'apollo-server-express';

export const typeDefs  = gql`
type User {
    id: ID!
    userName: String
    password: String
}

type ShopList {
    id: ID!
    name: String
    price: String
    src: String
}

type Query {
    getUsers: [User]
    getShopList: [ShopList]
    isAuthenticated: User
}
type Mutation {
    addUser(userName: String!, password: String!): User,
    loginUser(userName: String!, password: String!): User
}
`;


