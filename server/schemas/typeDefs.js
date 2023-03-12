// require apollo-server-express
const { gql } = require('apollo-server-express');
// define typeDefs, book schema, user schema, auth schema, book input form field values, the getme query, and mutations for login, add user, save book, and remove book
const typeDefs = gql`
    type Book {
        bookId: ID!
        authors: [String]
        description: String!
        title: String!
        image: String
        link: String
    }

    type User {
        _id: ID!
        username: String!
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Auth {
        token: ID!
        user: User
    }

    input BookInput {
        bookId: String!
        authors: [String]
        description: String!
        image: String
        link: String
        title: String!
    }

    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(bookInfo: BookInput!): User
        removeBook(bookId: ID!): User
    }
`;
// export typeDefs
module.exports = typeDefs;