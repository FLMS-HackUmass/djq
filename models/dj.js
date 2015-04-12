var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
// var bcrypt   = require('bcrypt-nodejs');

var Schema=mongoose.Schema;
 
var djSchema = new Schema({
	email: String,
  username: String,
  password: String,
  downvoteThreshold: {enabled: Boolean, threshold: Number},
	queue: [{
      title: String,
      // length: Number,
      url: String,
      thumbnail: String,
      timestamp: {type: Date, default: Date.now},
      priority: {type: Number, default: 0},
      sid: ObjectId
  }]
});

// // generating a hash
// djSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// djSchema.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
// };
 
module.exports = mongoose.model('DJ', djSchema);