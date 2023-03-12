// export function to get saved book ids from local storage
export const getSavedBookIds = () => {
  // get saved book ids from local storage
  const savedBookIds = localStorage.getItem('saved_books')
    // if saved book ids exist, parse them into an array, otherwise return an empty array
    ? JSON.parse(localStorage.getItem('saved_books'))
    : [];
  // return the array of saved book ids
  return savedBookIds;
};
// export function to save book ids to local storage
export const saveBookIds = (bookArray) => {
  // if book id array exists, save it to local storage, otherwise remove it from local storage
  if (bookArray.length) {
    localStorage.setItem('saved_books', JSON.stringify(bookArray));
  } else {
    localStorage.removeItem('saved_books');
  }
};
// export function to remove book id from local storage
export const removeBookId = (bookId) => {
  // get saved book ids from local storage
  const savedBookIds = localStorage.getItem('saved_books')
    // if saved book ids exist, parse them into an array, otherwise return null
    ? JSON.parse(localStorage.getItem('saved_books'))
    : null;
  // if there are no saved book ids, return false
  if (!savedBookIds) {
    return false;
  }
  // filter out the book id to be removed from the saved book ids array
  const updatedSavedBookIds = savedBookIds?.filter((savedBookId) => savedBookId !== bookId);
  // save the updated saved book ids array to local storage
  localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));
  // return true  
  return true;
};