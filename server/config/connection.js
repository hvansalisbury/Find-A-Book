// require mongoose
const mongoose = require('mongoose');
// connect to mongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/googlebooks', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// export connection
module.exports = mongoose.connection;