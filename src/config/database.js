const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect('mongodb+srv://kamal:kamal@namaste-node.kqec4yp.mongodb.net/dev-tinder');
};

module.exports = { connectDB };
