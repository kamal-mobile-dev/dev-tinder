var validator = require('validator');

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  // Validate firstName
  if (!firstName || typeof firstName !== 'string') {
    throw new Error('First name is required and must be a string');
  }
  if (firstName.length < 4 || firstName.length > 50) {
    throw new Error('First name must be 4-50 characters');
  }

  // Validate lastName
  if (!lastName || typeof lastName !== 'string') {
    throw new Error('Last name is required and must be a string');
  }
  if (lastName.length < 4 || lastName.length > 50) {
    throw new Error('Last name must be 4-50 characters');
  }

  // Validate email
  if (!emailId || typeof emailId !== 'string') {
    throw new Error('Email is required and must be a string');
  }

  if (!validator.isEmail(emailId)) {
    throw new Error('Email is not valid');
  }

  // Validate password
  if (!password || typeof password !== 'string') {
    throw new Error('Password is required and must be a string');
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error('Please enter strong Password');
  }
};

module.exports = { validateSignupData };
