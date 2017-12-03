var mongoose = require('mongoose');
var Schema = mongoose.Schema,
 ObjectId = Schema.ObjectId;


var usersSchema = new Schema({
     "_id" : ObjectId,
    "name" : String,
    "email" : String,
	"phone" : String,
    "username" : String,
    "password" : String,
    "created_at" : Date

}, { collection: 'users' });

var users = mongoose.model('users', usersSchema);

// make this available to our users in our Node applications
module.exports = users;


