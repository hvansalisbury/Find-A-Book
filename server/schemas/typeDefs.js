const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Book {
        bookId: ID!
        authors: [String]
        description: String
        title: String!
        image: String
        link: String
    }

    type User {
        _id: ID!
        username: String!
        email: String
        password: Int
        savedBooks: [Book]
    }

    type Auth {
        token: ID!
        user: User
    }

    input BookInput {
        authors: [String]
        description: String
        image: String
        link: String
        title: String!
    }

    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(bookInfo: BookInput!): User
        removeBook(bookId: ID!): User
    }
`;

module.exports = typeDefs;