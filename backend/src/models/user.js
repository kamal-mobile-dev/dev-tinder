const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
var validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50
    },
    lastName: {
      type: String
    },
    emailId: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error('Invalid Email ' + value);
      }
    },
    password: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      min: 18
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'others'],
        message: `{VALUE} is invalid gender type`
      }
    },
    photoUrl: {
      type: String,
      default:
        'https://t4.ftcdn.net/jpg/12/86/22/49/240_F_1286224950_rVyep2TACbCiLzwBmKkN7uGlJLfHou9D.jpg'
    },
    about: {
      type: String,
      default: 'This is test'
    },
    skills: {
      type: [String],
      validate: [
        {
          validator: function (skills) {
            return skills.length <= 5; // max 5 skills
          },
          message: 'You can only add up to 5 skills.'
        },
        {
          validator: function (skills) {
            return new Set(skills.map((skill) => skill.toLowerCase())).size === skills.length;
          },
          message: 'Duplicate skills are not allowed.'
        }
      ]
    }
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return token;
};

userSchema.methods.isValidPassword = async function (password) {
  const isValidPassword = await bcrypt.compareSync(password, this.password);
  return isValidPassword;
};

module.exports = mongoose.model('User', userSchema);
