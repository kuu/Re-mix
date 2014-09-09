var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  type: { type: String }, // private/protected/public
  owner: { type: String }, // user-id
  organization: { type: String }, // org-id
  origin: {
    user: { type: String }, // forked from (user-id)
    proj: { type: String }  // forked from (proj-id)
  },
  description: { type: String },
  tags: { type: [String] },
  forks: { type: [String] }, // forked by (user-id)
  starred: { type: [String] }, // starred by (user-id)
  tracks: [
    {
      id: { type: String }, // track-id
      type: { type: String }, // file extension
      owner: { type: String }, // user-id
      label: { type: String },
      enabled: { type: Boolean }
    }
  ],
  contributors: { type: [Number] } // user-id
});

module.exports = mongoose.model('project', schema);
