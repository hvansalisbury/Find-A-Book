// imports jsonwebtoken decode function
import decode from 'jwt-decode';
// creates AuthService class
class AuthService {
  // function to get the profile data from the token using decode function
  getProfile() {
    return decode(this.getToken());
  }
  // function to check if the user is logged in
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }
  // function to check if the token is expired
  isTokenExpired(token) {
    // try/catch to handle errors
    try {
      // decode the token
      const decoded = decode(token);
      // check if the token is expired
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }
  // function to get the token from local storage
  getToken() {
    return localStorage.getItem('id_token');
  }
  // function to login the user
  login(idToken) {
    // set the token in local storage
    localStorage.setItem('id_token', idToken);
    // reload the page
    window.location.assign('/');
  }
  // function to logout the user
  logout() {
    // remove the token from local storage
    localStorage.removeItem('id_token');
    // reload the page
    window.location.assign('/');
  }
}
// exports the AuthService class
export default new AuthService();