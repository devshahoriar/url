import mongoose from 'mongoose';

const people = mongoose.Schema({
  user: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
  },
  pass: {
    type: String,
  },
  token: {
    type: Number,
    length: 6,
  },
  tokenAge: {
    type: Date,
  }
});

const People = mongoose.model('people', people);
export default People;