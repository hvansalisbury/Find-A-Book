// imports react, react hooks, and bootstrap components
import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
// imports auth helper function
import Auth from '../utils/auth';
// imports useMutation hook from Apollo client to modify data
import { useMutation } from '@apollo/client';
// imports ADD_USER mutation
import { ADD_USER } from '../utils/mutations';
// signup form function
const SignupForm = () => {
  // set initial form state
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  // set state for form validation
  const [validated] = useState(false);
  // set state for alert
  const [showAlert, setShowAlert] = useState(false);
  // define adduser mutation
  const [addUser, { error }] = useMutation(ADD_USER);
// determining if the error alert needs to be shown
  useEffect(() => {
    if (error) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [error]);
// handle form input changes
  const handleInputChange = (event) => {
    // gets name and value of input changing
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
      // execute addUser mutation and pass in variable data from the form
      const { data } = await addUser({
        variables: { ...userFormData },
      });
      // uses helper function to save token to localStorage
      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
    }
// clears form
    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };
// returns html form
  return (
    <>
      {/* This is needed for the validation functionality above */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* show alert if server response is bad */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your signup!
        </Alert>

        <Form.Group>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
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
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};
// exports signup form
export default SignupForm;