var express     = require('express');
var ObjectId = require('mongodb').ObjectID;
var basicAuth = require('express-basic-auth');
var basicAuth = require('basic-auth');
var path = require('path');
var jwt =  require('jsonwebtoken');
var crypto = require('crypto');
var auth = require('auth');
var app = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var fs = require('fs')
var mongoose = require('mongoose');
var config = require('./config')
var app = express();
var mongooseRedisCache = require("mongoose-redis-cache");
mongooseRedisCache(mongoose)
var users = require('./models/users.js'); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.set('secret', config.secret);
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
// function for authentication

var checkAuthentication = function(req, res, next){
    var passedToken = req.body.token || req.query.token || req.headers['token'];
    if(passedToken){
        console.log('Authenticating token , please wait ....');
        jwt.verify(passedToken, app.get('secret'), function(err, decoded){
           if(err){
               console.log('error in token validation : ', err);
               res.send({ status : 500, msg : 'token validation failed'});
           } 
           else{
               console.log('Token matched ');
            //req.decoded = decoded;  
            next();
               
           }
        }
    )
}
    else{
    console.log('Authenticating credentials please wait');
    var credentials =basicAuth(req);
    if(!credentials || !credentials.name || !credentials.pass){
        console.log('Please enter username password');
        res.send({status : 401, msg : "Please enter username password"});
    }
    else{
        console.log(credentials);
        var hashPassword = crypto.createHash('md5').update(credentials.pass).digest('hex');
        users.find({username : credentials.name , password : hashPassword}, function(err, userData){
            if(err){
                console.log(err);
                res.send({status : 401, msg : "Authentication failed"});
            }
            else{
                if(userData.length > 0){
                    //console.log(userData);
                    const payload = {
                        username : credentials.name 
                    };
                    var token = jwt.sign(payload, app.get('secret'), {
                        expiresIn: 1440 // expires in 24 hours
                      });
                      
                    //return next()
                    res.send( { 'status' : 200, 'msg' : 'enjoy your token', 'token' : token});
                }
                else{
                    console.log({status : 401, msg : "Invalid credentials"});
                    res.send({status : 401, msg : "Invalid credentials"});
                }
            }
        })
    }
}
}


// setup the logger
//app.use(morgan('combined', {stream: accessLogStream}))
app.use(morgan('{"remote_addr": ":remote-addr", "remote_user": ":remote-user", "date": ":date[clf]", "method": ":method", "url": ":url", "http_version": ":http-version", "status": ":status", "result_length": ":res[content-length]", "referrer": ":referrer", "user_agent": ":user-agent", "response_time": ":response-time"}', {stream: accessLogStream}));

mongoose.connect(config.database);


var userController = require('./controllers/userControllers');

app.post('/onelabs/createUser', userController.createUser);

var ebayProductController = require('./controllers/ebayProductsController');

app.get('/onelabs/getproducts', ebayProductController.searchProductbyName);








var port = process.env.PORT || 9000;

app.listen(port);