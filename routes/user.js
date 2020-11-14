const express = require('express');
const router = express.Router();
const uid2 = require('uid2');
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const cloudinary = require("cloudinary").v2;
// const nodemailer = require("nodemailer");
require("dotenv").config;

const isAuthenticated = require('../middleware/isAuthenticated')
const User = require('../model/User');
const Company = require('../model/Company');
const Product = require('../model/Product');
const Order = require('../model/Order')

router.get('/alluser', async (req, res) => {
    const alluser = await User.find().select('_id account token');
    return res.status(200).json({ alluser });

});
router.post('/user/signup', async (req, res) => {
    try {
        const { email, password, firstname, lastname, phone, username } = req.fields;

        const userMails = await User.findOne({ email })
        const userName = await User.findOne({ username })

        if (userName) {
            return res.status(400).json({ error: 'username already exists' })
        }
        if (userMails) {
            return res.status(400).json({ error: "user's mail already exists" })
        }
        else if (email || password || username || firstname || lastname) {
            const token = uid2(64);
            const salt = uid2(64);
            const hash = SHA256(password + salt).toString(encBase64);

            const newUser = new User({
                email,
                token,
                hash,
                salt,
                account: {
                    username,
                    firstname,
                    lastname,
                },
                phone,
            });
            await newUser.save();

            return res.status(200).json({
                _id: newUser._id,
                token: newUser.token,
                email: newUser.email,
                username: newUser.account.username,
                firstname: newUser.account.firstname,
                lastname: newUser.account.lastname,
            })
        } else {
            return res.status(400).json({
                error: "Missing parameters.",
            });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
})


router.put('/user/update-password/', isAuthenticated, async (req, res) => {
    try {
        const { previousPassword, newPassword } = req.fields;
        if (previousPassword && newPassword && previousPassword !== newPassword) {
            const user = await User.findById(req.user._id)
            if (user && SHA256(previousPassword + user.salt).toString(encBase64) ===
                user.hash) {
                const newSalt = await uid2(64);
                const newHash = await SHA256(newPassword + newSalt).toString(encBase64);
                user.hash = newHash;
                user.salt = newSalt;
                user.save();
                return res.status(200).json({ message: 'Successfully' })
            } else {
                return res.status(401).json({ error: 'Invalid password' })
            }
        } else {
            return res.status(401).json({ error: 'missing parameters' })
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
})

router.get('/user/recover-password/', isAuthenticated, async (req, res) => {
    try {
        if (req.headers.authorization && req.user._id) {
            const user = await User.findById(req.user._id)
            if (user) {
                const transporter = await nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.MAILADRESS,
                        pass: process.env.MAILPASSWORD,
                    }
                })
                const mailOptions = {
                    from: process.env.MAILADRESS,
                    to: user.email,
                    subject: 'Changez votre mot de passe',
                    text: "it's easy! with process.env"
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return res.status(403).json(error);
                    } else {
                        return res.status(200).json('Email sent' + info.response)
                    }
                })
            } else {
                return res.status(403).json({ error: "User doesn't exist" })
            }
        } else {
            return res.status(403).json({ error: "missing parameters" })
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });

    }
});

router.delete("/user/delete/:id", isAuthenticated, async (req, res) => {
    if (req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUserToken = await req.headers.authorization.replace(
                "Bearer ",
                ""
            );
            if (user && String(req.user._id) === String(req.params.id) && currentUserToken === user.token) {
                await User.findByIdAndRemove(req.params.id);

                return res.status(200).json({ message: "User deleted" });
            } else {
                return res.status(400).json({ error: "User not found" });
            }
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } else {
        return res.status(400).json({ error: "Missing user id" });
    }
});

router.put('/user/update/:id', isAuthenticated, async (req, res) => {
    if (req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUserToken = await req.headers.authorization.replace(
                "Bearer ",
                "")
            if (user && String(req.user._id) === String(req.params.id) && currentUserToken === user.token) {
                const { email, username, firstname, lastname, phone } = req.fields;
                const findByEmail = await User.findOne({
                    email: email,
                });
                const findByUsername = await User.findOne({
                    "account.username": username,
                });
                if (findByEmail || findByUsername) {
                    return res.status(403).json({ error: "Username or Email already exists" })
                } else {
                    user.account.username = username ? username : user.account.username;
                    user.email = email ? email : user.email;
                    user.account.firstname = firstname ? firstname : user.account.firstname;
                    user.account.lastname = lastname ? lastname : user.account.lastname;
                    user.phone = phone ? phone : user.phone;

                    await user.save();
                    return res.status(200).json({
                        _id: user._id,
                        email: user.email,
                        account: user.account
                    })
                }
            } else {
                return res.status(400).json({ error: 'invalid' })
            }
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } else {
        return res.status(400).json({ error: 'invalid user id' })
    }
});

module.exports = router; 