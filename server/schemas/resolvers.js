// require user model
const { User } = require('../models');
// require signToken function from auth
const { signToken } = require('../utils/auth');
// requires AuthenticationError from apollo-server-express
const { AuthenticationError } = require('apollo-server-express');
// define resolvers
const resolvers = {
    // define Query
    Query: {
        // define me query
        me: async (parent, args, context) => {
            // if context has a user property, execute this code
            if (context.user) {
                // find a single user based on the _id and selects all data except password
                const dbUserData = await User.findOne({ _id: context.user._id }).select('-__v -password');
                return dbUserData;
            }
            // if user isn't logged in, throw an error
            throw new AuthenticationError('Please log in');
        },
    },
    // define Mutations
    Mutation: {
        // define addUser mutation
        addUser: async (parent, args) => {
            // create a user with arguments from form
            const user = await User.create(args);
            // create a token for the user
            const token = signToken(user);
            // return token and user
            return { token, user };
        },
        // define login mutation
        login: async (parent, { email, password }) => {
            // find a user based on email
            const user = await User.findOne({ email });
            // if no user is found, throw an error
            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }
            // determine is password is correct
            const correctPw = await user.isCorrectPassword(password);
            // if password is incorrect, throw an error
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            // create a token for the user
            const token = signToken(user);
            // return token and user
            return { token, user };
        },
        // define saveBook mutation
        saveBook: async (parent, { bookInfo }, context) => {
            // if context has a user property, execute this code
            if (context.user) {
                // find the user and push the bookInfo to the savedBooks array, and return the updated user
                const userUpdate = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookInfo } },
                    { new: true }
                );
                return userUpdate;
            }
            // if user isn't logged in, throw an error
            throw new AuthenticationError('Please log in');
        },
        // define removeBook mutation
        removeBook: async (parent, { bookId }, context) => {
            // if context has a user property, execute this code
            if (context.user) {
                // find the user and pull the bookId from the savedBooks array, and return the updated user
                const userUpdate = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
                return userUpdate;
            }
            // if user isn't logged in, throw an error
            throw new AuthenticationError('Please log in');
        },
    },
};
// export resolvers
module.exports = resolvers;