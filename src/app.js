const express = require('express');
const mongoose = require('mongoose');
const { adminAuth } = require('./middlewares/auth.js');
const { connectDB } = require('./config/database.js');
var cookieParser = require('cookie-parser');
const User = require('./models/user.js');
const { validateSignupData } = require('./utils/validation.js');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const JWT_SECRET = 'DDQk3uZcqisBQ5xU@#$WwmKySaCls9rTYfQ7%$#';

const saltRounds = 10;

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Utility function for standardized responses
const sendResponse = (res, statusCode, status, message, data = null) => {
  res.status(statusCode).json({ status, message, data });
};

// ========================= SIGNUP API =========================
app.post('/signup', async (req, res) => {
  try {
    // validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const hashPassword = await bcrypt.hash(password, saltRounds);
    console.log('hashPassword ', hashPassword);

    const user = new User({ firstName, lastName, emailId, password: hashPassword });

    await user.save();
    sendResponse(res, 201, 'success', 'User created successfully', user);
  } catch (err) {
    if (err.code === 11000) {
      return sendResponse(res, 400, 'failed', `Email '${req.body.emailId}' is already registered`);
    }
    sendResponse(res, 500, 'failed', 'Something went wrong', err.message);
  }
});

// ========================= SIGNUP API =========================
app.post('/login', async (req, res) => {
  try {
    // validateSignupData(req);

    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      sendResponse(res, 404, 'failed', 'incorrect credential ');
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (isValidPassword) {
      let token = jwt.sign({ emailId: user.emailId, id: user.id }, JWT_SECRET, {
        expiresIn: '1d' // expires in 24 hours
      });
      res.cookie('token', token);
      sendResponse(res, 201, 'success', 'User login successfully', { userId: user.id });
    } else sendResponse(res, 404, 'failed', 'incorrect credential');
  } catch (err) {
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

// ========================= GET USER =========================
app.get('/profile', adminAuth, async (req, res) => {
  try {
    sendResponse(res, 200, 'success', 'Users fetched successfully', req.user);
  } catch (error) {
    console.error('Error fetching users:', error);
    sendResponse(res, 500, 'failed', 'Internal server error');
  }
});

// ========================= Send Connection Request =========================
app.post('/sendConnectionRequest', adminAuth, async (req, res) => {
  try {
    sendResponse(res, 200, 'success', 'request send successfuly', req.user);
  } catch (error) {
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
