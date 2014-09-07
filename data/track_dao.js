var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  id: { type: String}, // track-id (yyyymmddhhmmssxx)
  owner: { type: String }, // user-id
  organization: { type: String }, // org-id
  type: { type: String }, // media type
  original_proj: {
    owner: { type: String }, // user-id
    proj: { type: String }  // proj-id
  },
  reference: [
    {
      owner: { type: String }, // user-id
      proj: { type: String }  // proj-id
    }
  ]
});

module.exports = mongoose.model('track', schema);
