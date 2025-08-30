const express = require('express');
const { connectDB } = require('./config/database.js');
var cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth.js');
const profileRouter = require('./routes/profile.js');
const requestRouter = require('./routes/requests.js');
const userRouter = require('./routes/user.js');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

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
