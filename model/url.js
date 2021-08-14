import mongoose from "mongoose";
const urlSc = new mongoose.Schema({
  url: {
    type: String,
  },
  sortText: {
    type: String,
    unique: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  auther: {
    type: mongoose.ObjectId,
    ref: 'people',
  },
});
const Url = mongoose.model('url', urlSc);
export default Url;