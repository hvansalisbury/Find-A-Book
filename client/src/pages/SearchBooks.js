// imports react, react hooks, react-bootstrap components, and auth helper function
import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';
import Auth from '../utils/auth';
// imports saveBookIds and getSavedBookIds helper functions
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
// imports useMutation hook from Apollo client to modify data
import { useMutation } from '@apollo/client';
// imports SAVE_BOOK mutation
import { SAVE_BOOK } from '../utils/mutations';
// function to render search books
const SearchBooks = () => {
  // define state variables for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  // define saveBook mutation
  const [saveBook, { error }] = useMutation(SAVE_BOOK);
  // gets saved book ids from localStorage on initial render
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });
  // function to handle book search form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // if no search input, return false
    if (!searchInput) {
      return false;
    }
    // try/catch to handle errors
    try {
      // uses fetch to make a request to the Google Books API
      const googleAPI = 'https://www.googleapis.com/books/v1/volumes?q=';
      const response = await fetch(`${googleAPI}${searchInput}`);
      // if response is not ok, throw an error
      if (!response.ok) {
        throw new Error('something went wrong!');
      }
      // destructure json from the response
      const { items } = await response.json();
      // map through the items array and create a new array of objects with only the data we need for displaying
      const bookInfo = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));
      // set the state for the searched books
      setSearchedBooks(bookInfo);
      // clears input
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };
  // function to handle saving a book to the database
  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    // ternary operator to check if user is logged in and get token, otherwise null
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    // if no token, return false
    if (!token) {
      return false;
    }
    // try/catch to handle errors
    try {
      // use the saveBook mutation
      const { data } = await saveBook({ variables: { bookInfo: { ...bookToSave } } });
      // save the book id to the array of saved book ids
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };
  // returns the search books page html
  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <CardColumns>
          {searchedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? (
                  <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveBook(book.bookId)}>
                      {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                        ? 'This book has already been saved!'
                        : 'Save this Book!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};
// exports SearchBooks function
export default SearchBooks;