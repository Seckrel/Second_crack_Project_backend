import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type GetUserInfo {
    userName: String
    firstName: String
    lastName: String
    phnNumber: String
    address: String
    city: String
    state: String
    error: String
  }
  type Detail {
    _id: ID!
    name: String
    price: String
    src: String
    _reviewId: [Reviews]
  }

  type Reviews {
    _id: ID!
    review: String
    createdAt: String
    updatedAt: String
    stars: Int
    _userId: User
    editable: Boolean
    error: String
  }

  type User {
    userName: String
  }

  type LoginUser {
    userName: String!
    firstName: String!
    lastName: String
    phnNumber: String
    flag: Boolean!
    msg: String
    error: String
  }
  type UpdateUser {
    userName: String!
    firstName: String!
    lastName: String
    phnNumber: String
    address: String
    city: String
    state: String
    error: String
  }

  type NewUser {
    flag: Boolean!
    msg: String
    error: String
  }

  type ShopList {
    id: ID!
    name: String
    price: String
    src: String
    quantity: Int
  }

  type LogOut {
    flag: Boolean!
    error: String
  }

  type PlaceOrder {
    orderCompleted: Boolean!
  }


  type OrderConfirm {
    orderCompleted: Boolean!
    error: String
  }

  input PaymentProps{
    productId: String
    quantity: Int
  }


  type Query {
    getUsers: GetUserInfo
    getShopList: [ShopList]
    getProductDetail(productId: String!): Detail
    placeOrder(productId: String!): PlaceOrder
    isAuthenticated: Boolean!
  }
  type Mutation {
    addUser(
      userName: String!
      password: String!
      firstName: String
      lastName: String
      phnNumber: String
    ): NewUser
    loginUser(userName: String!, password: String!): LoginUser
    invalidateToken: LogOut
    addReview(
      review: String!
      productId: String!
      stars: Int
      reviewId: String
    ): Reviews
    updateUser(
      newPassword: String
      currentPassword: String
      firstName: String!
      lastName: String
      phnNumber: String
      address: String
      city: String
      state: String
    ): UpdateUser
    payment(orderList: [PaymentProps!]!): OrderConfirm
  }
`;
