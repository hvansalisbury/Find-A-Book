const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const dbUserData = await User.findOne({ _id: context.user._id }).select('-__v -password');
                return dbUserData;
            }
            throw new AuthenticationError('Please log in');
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { bookInfo }, context) => {
            if (context.user) {
                const userUpdate = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookInfo } },
                    { new: true }
                );
                return userUpdate;
            }
            throw new AuthenticationError('Please log in');
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const userUpdate = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
                return userUpdate;
            }
            throw new AuthenticationError('Please log in');
        },

    },
};

module.exports = resolvers;