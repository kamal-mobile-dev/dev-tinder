var validator = require('validator');
const { sendResponse } = require('../utils/helper.js');

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

const validateEditProfileData = (req, res) => {
  const AllowedEditFields = [
    'photoUrl',
    'skills',
    'age',
    'gender',
    'firstName',
    'lastName',
    'emailId',
    'about'
  ];
  const isEditAllowed = Object.keys(req.body).every((item) => AllowedEditFields.includes(item));

  if (!isEditAllowed) {
    sendResponse(res, 500, 'failed', 'Invalid Edit Request');
  }

  const { photoUrl, skills, age, gender } = req.body;
  console.log(age);
  if (photoUrl && !validator.isURL(photoUrl)) {
    sendResponse(res, 500, 'failed', 'Please supply valid photo url');
  }

  if (skills && skills.length > 5) {
    sendResponse(res, 500, 'failed', 'Please skills length must be less than or equal 5');
  }
  if (age === 0 || (age && age < 18)) {
    sendResponse(res, 500, 'failed', 'Please age must be above 18');
  }
  if (gender && !['male', 'female'].includes(gender)) {
    sendResponse(res, 500, 'failed', 'Please gender must be male or female ');
  }
};

module.exports = { validateSignupData, validateEditProfileData };
