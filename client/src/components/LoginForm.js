// import react and react hooks, and bootstrap components
import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
// import helper file for authentication
import Auth from '../utils/auth';
// import useMutation hook from Apollo client to modify data
import { useMutation } from '@apollo/client';
// import LOGIN_USER mutation
import { LOGIN_USER } from '../utils/mutations';
// login form function
const LoginForm = () => {
  // define state variables for form data, valication, and alert
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // define login mutation
  const [login, { error }] = useMutation(LOGIN_USER);
  // determining if the error alert needs to be shown
  useEffect(() => {
    if (error) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [error]);
  // function to handle changes to the form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };
  // function to handle form submission
  const handleFormSubmit = async (event) => {
    // prevents default form submssion behavior
    event.preventDefault();
    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    // use try/catch instead of promises to handle errors
    try {
      // execute login mutation and pass in variable data from the form
      const { data } = await login({
        variables: { ...userFormData },
      });
      // uses helper function to save token to localStorage
      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
    }
    // clears form
    setUserFormData({
      email: '',
      password: '',
    });
  };
  // returns html form
  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};
// exports loginform
export default LoginForm;