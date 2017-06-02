var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var requestLanguage = require('express-request-language');
var cookieParser = require('cookie-parser');
var cloudinary = require('cloudinary');
var winston = require('winston');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var app = express();
var router = express.Router();

var admin = require('firebase-admin');
var serviceAccount = require('./_path/serviceAccountKey.json');

// connecting mongodb
var mongodburi = 'mongodb://einz:einz123@ds161931.mlab.com:61931/trackingproject';
// var mongodburi = 'mongodb://localhost:27017/Capstone';
mongoose.Promise = global.Promise;
var options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};
mongoose.connect(mongodburi, options);

// firebase admin setting
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bgoapp-85a14.firebaseio.com",
    databaseAuthVariableOverride: null
});

// var db = admin.database();
// var ref = db.ref("/public_resource");
// ref.once("value", function (snapshot) {
//     console.log(snapshot.val());
// });

// config cloudinary
cloudinary.config({
    cloud_name: 'einzweidrei2',
    api_key: '923252816135765',
    api_secret: '5bBDapVrya9p73sXqvZNZc029lE'
});

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.use(cookieParser());

app.use('/admin/account', require('./_routes/web-admin/account.route'));

app.listen(process.env.PORT || 6969, function () {
    console.log('listening on 6969 <3')
});
