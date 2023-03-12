// import gql from apollo client
import { gql } from '@apollo/client';
// exports query for getting data about user logged in
export const GET_ME = gql`
  {
    me {
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