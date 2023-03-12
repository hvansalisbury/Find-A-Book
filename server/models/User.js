// requires schema and model from mongoose
const { Schema, model } = require('mongoose');
// requires bcrypt
const bcrypt = require('bcrypt');
// requires bookSchema
const bookSchema = require('./Book');
// define userSchema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    savedBooks: [bookSchema],
  },
  {
    toJSON: {
      // include any virtual properties when data is requested
      virtuals: true,
    },
  }
);
// set up pre-save middleware to create password
userSchema.pre('save', async function (next) {
  // if password was not modified, move on to the next middleware
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  // move on to next
  next();
});
// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
// get total count of books saved by user
userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});
// create User model using userSchema
const User = model('User', userSchema);
// export User model
module.exports = User;