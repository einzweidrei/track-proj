var express = require('express');
var mongoose = require('mongoose');
var async = require('promise-async');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var ObjectId = require('mongoose').Types.ObjectId;
var cloudinary = require('cloudinary');
var admin = require("firebase-admin");
var db = admin.database();

var User = require('../../_models/user');
var messageService = require('../../_services/message.service');
var msg = new messageService.Message();

// middleware
router.use(function (req, res, next) {
    console.log('owner_router is connecting');
    next();
});

router.route('/getUserByEmail').get((req, res) => {
    try {
        var email = req.query.email;

        admin.auth().getUserByEmail(email)
            .then(function (userRecord) {
                // See the UserRecord reference doc for the contents of userRecord.
                console.log("Successfully fetched user data:", userRecord.toJSON());
                return msg.msgReturn(res, 0, userRecord.toJSON());
            })
            .catch(function (error) {
                console.log("Error fetching user data:", error);
                return msg.msgReturn(res, 3);
            });
    } catch (error) {
        return msg.msgReturn(res, 3);
    }
});

router.route('/getUserById').get((req, res) => {
    try {
        var uid = req.query.uid;

        admin.auth().getUser(uid)
            .then(function (userRecord) {
                // See the UserRecord reference doc for the contents of userRecord.
                console.log("Successfully fetched user data:", userRecord.toJSON());
                return msg.msgReturn(res, 0, userRecord.toJSON());
            })
            .catch(function (error) {
                console.log("Error fetching user data:", error);
                return msg.msgReturn(res, 3);
            });
    } catch (error) {
        return msg.msgReturn(res, 3);
    }
});

router.route('/create').post((req, res) => {
    try {
        var email = req.body.email;
        var password = req.body.password;
        var displayName = req.body.displayName;

        var gender = req.body.gender || 0;
        var phone = req.body.phone;

        admin.auth().createUser({
            email: email,
            emailVerified: false,
            password: password,
            displayName: displayName,
            photoURL: "http://www.example.com/12345678/photo.png",
            disabled: false
        })
            .then((userRecord) => {
                console.log("Successfully created new user:", userRecord.uid);

                var user = new User();
                user._id = userRecord.uid;
                user.info = {
                    displayName: displayName,
                    email: email,
                    gender: gender,
                    phone: phone,
                    image: 'http://www.example.com/12345678/photo.png'
                };
                user.history = {
                    createAt: new Date(),
                    updateAt: new Date()
                };
                user.status = true;

                user.save((error) => {
                    if (error) {
                        console.log(error);
                        return msg.msgReturn(res, 3);
                    }
                    return msg.msgReturn(res, 0, userRecord.uid);
                });
            })
            .catch((error) => {
                console.log("Error creating new user:", error);
                return msg.msgReturn(res, 3);
            });
    } catch (error) {
        return msg.msgReturn(res, 3);
    }
});

router.route('/update').post((req, res) => {
    try {
        var email = req.body.email;
        var password = req.body.password;
        var displayName = req.body.displayName;

        var gender = req.body.gender || 0;
        var phone = req.body.phone;

        admin.auth().updateUser(uid, {
            email: email,
            emailVerified: true,
            password: password,
            displayName: displayName,
            photoURL: "http://www.example.com/12345678/photo.png",
            disabled: true
        })
            .then(function (userRecord) {
                // See the UserRecord reference doc for the contents of userRecord.
                console.log("Successfully updated user", userRecord.toJSON());

                var info = {
                    displayName: displayName,
                    email: email,
                    gender: gender,
                    phone: phone,
                    image: 'http://www.example.com/12345678/photo.png'
                };

                User.findOneAndUpdate(
                    {
                        _id: userRecord.uid,
                        status: true
                    },
                    {
                        $set: {
                            info: info,
                            history: {
                                updateAt: new Date()
                            }
                        }
                    },
                    {
                        upsert: true
                    },
                    (error) => {
                        if (error) return msg.msgReturn(res, 3);
                        return msg.msgReturn(res, 0);
                    }
                );

                return msg.msgReturn(res, 0, userRecord);
            })
            .catch(function (error) {
                console.log("Error updating user:", error);
                return msg.msgReturn(res, 3);
            });
    } catch (error) {
        return msg.msgReturn(res, 3);
    }
});

router.route('/delete').post((req, res) => {
    try {
        var uid = req.query.uid;

        admin.auth().deleteUser(uid)
            .then(function () {
                console.log("Successfully deleted user");

                User.findByIdAndRemove(
                    {
                        _id: uid
                    },
                    (error) => {

                    }
                )

                return msg.msgReturn(res, 0);
            })
            .catch(function (error) {
                console.log("Error deleting user:", error);
                return msg.msgReturn(res, 3);
            });
    } catch (error) {
        return msg.msgReturn(res, 3);
    }
});

module.exports = router;