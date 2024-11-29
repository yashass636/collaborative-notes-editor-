const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const Document = new Schema({
  user: {
    type: String
  },
  headline: {
    type: String,
    default: "Unknown"
  },
  _id: String,
  data: Object,
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = model("Document", Document);
