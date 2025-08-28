const mongoose = require('mongoose');

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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          throw new Error('Invalid email format');
        }
      }
    },
    password: {
      type: String,
      required: true
    },
    age: {
      type: Number
    },
    gender: {
      type: String,
      min: 18
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
      type: [String]
    }
  },
  { timestamps: true }
);

userSchema.index({ emailId: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
