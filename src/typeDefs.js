import { gql } from 'apollo-server-express';

export const typeDefs  = gql`
type User {
    id: ID!
    userName: String
    password: String
    count: String
}

type ShopList {
    id: ID!
    name: String
    price: String
    src: String
}

type Reviews {
    id: ID!
    review: String
    createdAt: String
    updatedAt: String
    stars: Int
}

type detail {
    id: ID!
    name: String
    price: String
    src: String
    _reviewId: [Reviews]
}
type Query {
    getUsers: [User]
    getShopList: [ShopList]
    getProductDetail(productId: String!): detail
    isAuthenticated: Boolean!
}
type Mutation {
    addUser(userName: String!, password: String!): User,
    loginUser(userName: String!, password: String!): User,
    invalidateToken: Boolean!,
    addReview(review: String!, productId: String!, stars: Int): Reviews
}
`;


