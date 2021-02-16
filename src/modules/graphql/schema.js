import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar Date

  input InputForCreateUser {
    name: String!
    email: String!
    password: String!
  }

  input InputForUpdateUser {
    name: String
    password: String
  }

  type User {
    _id: ID
    name: String
    email: String
    role: String
    createdAt: Date
    updatedAt: Date
  }

  input InputForCreateProduct {
    sku: String!
    name: String!
    brand: String!
    price: Float!
  }

  input InputForUpdateProduct {
    sku: String
    name: String
    brand: String
    price: Float
  }

  type Product {
    _id: ID
    sku: String
    name: String
    brand: String
    price: Float
    createdAt: Date
    updatedAt: Date
  }

  type ProductsResult {
    products: [Product]
    currentPage: Int
    totalPages: Int
  }

  type Query {
    getUsers(query: String): [User]
    getUser(id: ID!): User
    getProducts(query: String, price: Float, page: Int, limit: Int): ProductsResult
    getProduct(id: ID!): Product
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Mutation {
    addUser(query: InputForCreateUser!): User
    updateUser(id: ID!, query: InputForUpdateUser!): User
    deleteUser(id: ID!): User
    login(email: String!, password: String!): AuthPayload!
    addProduct(query: InputForCreateProduct!): Product
    updateProduct(id: ID!, query: InputForUpdateProduct!): Product
    deleteProduct(id: ID!): Product
  }
`;
