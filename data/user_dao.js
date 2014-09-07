var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  type: { type: String },
  avatar: { type: String }, // gravatar url
  gravatar_id: { type: String }, // gravatar id
  organizations: { type: [String] }, // org-id
  projects: { type: [String] }, // proj-id
  playlists: { type: [String] }, // list-id
  followers: { type: [String] }, // user-id
  following: { type: [String] }, // user-id
  email: { type: String },
  url: { type: String },
  company: { type: String },
  location: { type: String },
  hash: { type: String },
  admin: { type: Boolean }
});

module.exports = mongoose.model('user', schema);
