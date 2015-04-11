var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectID;
var bcrypt   = require('bcrypt-nodejs');

var Schema=mongoose.Schema;
 
var djSchema = new Schema({
	email: String,
  username: String,
  password: String,
  downvoteThreshold: {Boolean, Number},
	queue: [
    song:{
      title: String,
      artist: String,
      length: String,
      url: String,
      thumbnail: String,
      timestamp: Date.now,
      priority: Number,
      sid: ObjectID
  }]
});

// generating a hash
djSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

djSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
 
module.exports = mongoose.model('DJ', djSchema);