import express, { Request, Response } from 'express'
const router = express.Router()
import uid2 from 'uid2'
import SHA256 from "crypto-js/sha256"
import encBase64 from "crypto-js/enc-base64"
import cloudinary from "cloudinary"
import nodemailer from "nodemailer"
require("dotenv").config;

import isAuthenticated from '../middleware/isAuthenticated'
import { Role, Roles } from '../middleware/role'
import checkRole from '../middleware/checkRole'
import User from '../model/User'
import Company from '../model/Company'
import Product from '../model/Product'
import Order from '../model/Order'
import { IGetUserAuthInfoRequest } from '../types/types'

router.get('/alluser', isAuthenticated, checkRole(Role.Admin), async (req : Request, res: Response) => {
    const alluser = await User.find().select('_id account token');
    return res.status(200).json(alluser);
    // don't forget to delete this route
});

router.post('/user/signup', async (req, res) => {
    try {
        const email : string = req.fields?.email
        const password: string = req.fields?.password
        const firstname: string = req.fields?.firstname
        const lastname: string = req.fields?.lastname
        const phone: string = req.fields?.phone

        const userMails = await User.findOne({ email })

        if (userMails) {
            return res.status(400).json({ error: "user's mail already exists" })
        }
        else if (email || password || firstname || lastname) {
            const token = uid2(64);
            const salt = uid2(64);
            const hash = SHA256(password + salt).toString(encBase64);

            const newUser = new User({
                email,
                role: Role.User,
                token,
                hash,
                salt,
                account: {
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


router.put('/user/update-password/', isAuthenticated, checkRole(Role.User), async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
        const previousPassword :string = req.fields?.previousPassword
        const newPassword: string = req.fields?.newPassword
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

router.get('/user/recover-password/', isAuthenticated, checkRole(Role.User), async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
        if (req.headers.authorization && req.user._id) {
            const user = await User.findById(req.user._id)

            if (user) {
                const transporter = await nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: `${process.env.MAIL_ADRESS}`,
                        pass: `${process.env.MAIL_MDP}`,
                    }
                })

                const mailOptions = {
                    from: `${process.env.MAIL_ADRESS}`,
                    to: user.email,
                    subject: 'Changez votre mot de passe',
                    text: `vous recevez ce mail parceque vous avez demandé à reset votre mot de passe. \n\n` +
                        `Cliquer sur le lien suivant afin de mettre a jour votre mot de passe. Ce lien est valable 1h :\n\n` +
                        `http://localhost:3000/reset/${user.token}`,
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

router.delete("/user/delete/:id", isAuthenticated, checkRole(Role.User), async (req: IGetUserAuthInfoRequest, res: Response) => {
    if (req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUserToken = req.headers.authorization?.replace(
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

router.put('/user/update/:id', isAuthenticated, checkRole(Role.User), async (req: IGetUserAuthInfoRequest, res: Response) => {
    if (req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUserToken = req.headers.authorization?.replace(
                "Bearer ",
                "")
            if (user && String(req.user._id) === String(req.params.id) && currentUserToken === user.token) {
                const email : string = req.fields?.email
                const username: string = req.fields?.username
                const firstname: string = req.fields?.firstname
                const lastname: string = req.fields?.lastname
                const phone: string = req.fields?.phone

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

export default router; 