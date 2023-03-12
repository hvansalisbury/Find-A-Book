// imports react, react-bootstrap components, and auth helper function
import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import Auth from '../utils/auth';
// imports removeBookId helper function
import { removeBookId } from '../utils/localStorage';
// imports useQuery and useMutation hooks from Apollo client to modify data
import { useQuery, useMutation } from '@apollo/client';
// imports GET_ME query and REMOVE_BOOK mutations
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
// function to render saved books
const SavedBooks = () => {
  // define removeBook mutation
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);
  // define data to be retrieved from GET_ME query
  const { loading, data } = useQuery(GET_ME);
  // define userData to be retrieved from data
  const userData = data?.me || {};
  // function to handle removing a saved book
  const handleRemoveBook = async (bookId) => {
    // ternary operator to check if logged in and get token, otherwise set to null
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    // if no token, return false
    if (!token) {
      return false;
    }
    // try/catch to handle errors
    try {
      // execute removeBook mutation and pass in variable data from the book's id
      const { data } = await removeBook({
        variables: { bookId: bookId },
      });
      // remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };
  // renders loading message if data is not yet retrieved
  if (loading) {
    return <h2>Loading...</h2>;
  }
  // returns html to render saved books
  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks?.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleRemoveBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};
// exports saved books function
export default SavedBooks;