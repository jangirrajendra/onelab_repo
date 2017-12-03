var users = require('../models/users');
var crypto = require('crypto');
var ObjectId = require('mongodb').ObjectID;
exports.findById = function(userId, callback){
    users.find( { _id : userId}, function(err, userData){
        if(err){
            console.log('error : ', err);
            return err;
        }
        else{
            console.log('userData : ', userData);
            return callback(userData);
        }
    })
}

exports.findByUsername = function(userName, callback){
    users.find({ username : userName}, function(err, userData){
        if(err){
            console.log('error : ', err);
            return err;
        }
        else{
            if(userData.length > 0 ){
                console.log('userData : ', userData);
                return callback(userData);
            }
            else{
                return callback(0);
            }
        }
    })
}

exports.createUser = function(req, res){
    console.log('Welcome to NodeJs');
    var username = req.body.username;
    console.log('username : ', username);
    console.log(req.body);
    users.find({ "username" : username }, function(err, uData){
        if(err){
            console.log('err : ', err);
            res.send( { status : 500, msg : 'Internal server error'});
        }
        else{
                console.log('uData[0].username : ', uData);
                if(uData.length > 0){
                    console.log('User Already exists');
                    res.send( { status : 200, msg : 'User already exists.'});
                }
                else{
                    console.log('Creating new user');
                    var newUser = new users(req.body);
                    var uId = new ObjectId();
                    var hashPassword = crypto.createHash('md5').update(req.body.password).digest('hex');
                    newUser.password = hashPassword;
                    newUser.created_at = new Date();
                    newUser._id = uId;
                    newUser.save(function(err){
                        if(err){
                            console.log({ status : 501, msg : err});
                            res.send({ status : 501, msg : err});
                        }
                        else{
                            console.log({ status : 200, msg : 'User Saved'});
                            res.send({ status : 200, msg : 'User Saved'});
                        }
                    })
                }
            }
    })

}