/**
 * Mongoose user model.
 */

import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 10,
    maxLength: 1000,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
})

export const Account = mongoose.model('Account', schema)
