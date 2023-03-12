// import gql from apollo client
import { gql } from '@apollo/client';
// exports mutation for login
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
// exports mutation for adding a user
export const ADD_USER = gql`
  mutation addUser($username: String!, $password: String!, $email: String!) {
    addUser(username: $username, password: $password, email: $email) {
      token
      user {
        _id
        username
      }
    }
  }
`;
// exports mutation for saving a book
export const SAVE_BOOK = gql`
  mutation saveBook($bookInfo: BookInput!) {
    saveBook(bookInfo: $bookInfo) {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        image
        link
        title
      }
    }
  }
`;
// exports mutation for removing a book
export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        image
        link
        title
      }
    }
  }
`;