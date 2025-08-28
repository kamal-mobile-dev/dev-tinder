const express = require('express');
const mongoose = require('mongoose');
const { connectDB } = require('./config/database.js');
const User = require('./models/user.js');

const app = express();

// Middleware
app.use(express.json());

// Utility function for standardized responses
const sendResponse = (res, statusCode, status, message, data = null) => {
  res.status(statusCode).json({ status, message, data });
};

// ========================= SIGNUP API =========================
app.post('/signup', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    sendResponse(res, 201, 'success', 'User created successfully', user);
  } catch (err) {
    if (err.code === 11000) {
      return sendResponse(res, 400, 'failed', `Email '${req.body.emailId}' is already registered`);
    }
    sendResponse(res, 500, 'failed', 'Something went wrong', err.message);
  }
});

// ========================= GET USER BY ID =========================
app.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, 'failed', 'Invalid user ID');
    }

    const user = await User.findById(id);

    if (!user) {
      return sendResponse(res, 404, 'failed', 'User not found');
    }

    sendResponse(res, 200, 'success', 'User fetched successfully', user);
  } catch (error) {
    console.error('Error fetching user:', error);
    sendResponse(res, 500, 'failed', 'Server error');
  }
});

// ========================= DELETE USER =========================
app.delete('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, 'failed', 'Invalid user ID');
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return sendResponse(res, 404, 'failed', 'User not found');
    }

    sendResponse(res, 200, 'success', 'User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    sendResponse(res, 500, 'failed', 'Internal server error');
  }
});

// ========================= UPDATE USER =========================
app.patch('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, 'failed', 'Invalid user ID');
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true, // Return updated document
      runValidators: true // ✅ Ensure validation runs
    });

    if (!updatedUser) {
      return sendResponse(res, 404, 'failed', 'User not found');
    }

    sendResponse(res, 200, 'success', 'User updated successfully', updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    sendResponse(res, 500, 'failed', 'Internal server error');
  }
});

// ========================= GET ALL USERS =========================
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    if (!users.length) {
      return sendResponse(res, 404, 'failed', 'No users found');
    }
    sendResponse(res, 200, 'success', 'Users fetched successfully', users);
  } catch (error) {
    console.error('Error fetching users:', error);
    sendResponse(res, 500, 'failed', 'Internal server error');
  }
});

// ========================= DATABASE CONNECTION =========================
connectDB()
  .then(() => {
    console.log('✅ Database connected successfully');
    app.listen(5000, () => {
      console.log('🚀 Server is running on http://localhost:5000');
    });
  })
  .catch(() => {
    console.log('❌ Something went wrong while connecting to the database');
  });
