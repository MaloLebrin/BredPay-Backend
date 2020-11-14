const express = require('express');
const router = express.Router();
const uid2 = require('uid2');
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const cloudinary = require("cloudinary").v2;
// const nodemailer = require("nodemailer");
require("dotenv").config;

const isAuthenticated = require('../middleware/isAuthenticated')
const Role = require('../middleware/Role')
const checkRole = require('../middleware/checkRole')
const User = require('../model/User');
const Company = require('../model/Company');
const Product = require('../model/Product');
const Order = require('../model/Order')

router.get('/', async (req, res) => {
    const { latitude, longitude, distance } = req.query;
    if (latitude && longitude) {
        const maxDistance = distance ? distance : 2;
        console.log(longitude, latitude);
        try {
            const company = await Company.find({
                location: {
                    $near: [latitude, longitude],
                    $maxDistance: 10,
                }
            }).select('_id token name email adress description phone postalCode city country location openingHours photo products');
            company

            return res.status(200).json(company)
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } else {
        try {
            const company = await Company.find().select('_id token name email adress description phone postalCode city country location openingHours photo products')
            return res.status(200).json(company)
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
})
router.post('/company-addpictures/:id', isAuthenticated, checkRole(Role.Company), async (req, res) => {
    if (req.files && req.user.id === req.params.id) {
        try {
            if (req.files.pictures) {
                const company = await Company.findById(req.user.id)
                const result = await cloudinary.uploader.upload(req.files.pictures.path, { //Only one picture
                    folder: `boulangerie/companies/${company._id}`,
                })
                company.photo = result;
                await company.save();
                return res.status(200).send(result)
            } else {
                return res.status(403).send('error')
            }
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } else {
        return res.status(403).json({ error: "unauthorized" })
    }
})

router.post('/create-account', async (req, res) => {
    try {
        const { name, email, password, username, firstname, lastname, phone, address, postalCode, city, country } = req.fields;
        const companyMails = await Company.findOne({ email })
        const companyUserNames = await Company.findOne({ username });
        if (companyUserNames) {
            return res.status(400).json({ error: 'username already exists' })
        } else if (companyMails) {
            return res.status(400).json({ error: "user's mail already exists" })
        } else if (email || name || password || username) {
            const token = uid2(64);
            const salt = uid2(64);
            const hash = SHA256(password + salt).toString(encBase64);
            const newCompany = new Company({
                name,
                role: Role.Company,
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
                address,
                city,
                country,
                postalCode,
            });
            await newCompany.save();
            return res.status(200).json({
                _id: newCompany._id,
                name: newCompany.name,
                token: newCompany.token,
                email: newCompany.email,
                username: newCompany.account.username,
                adress: newCompany.adress,
                phone: newCompany.phone,
                city: newCompany.city,
                postalCode: newCompany.postalCode,
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
router.get('/:id', async (req, res) => {
    if (req.params.id) {
        try {
            const company = await Company.findById(req.params.id).populate("products");
            return res.status(200).json(company);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } else {
        return res.status(400).json({ error: "no id company selected" });
    }
})
router.put('/company-update/:id', isAuthenticated, checkRole(Role.Company), async (req, res) => {
    if (req.headers.authorization && req.user._id && req.params.id) {
        const { name, email, username, firstname, lastname, phone, description, address, postalCode, city, country } = req.fields;
        const Location = [req.fields.location.long, req.fields.location.lat];

        const company = await Company.findById(req.params.id)
        const currentUserToken = await req.headers.authorization.replace(
            "Bearer ",
            "")
        if (currentUserToken === company.token && req.params.id === company.id) {
            company.name = name ? name : company.name;
            company.email = email ? email : company.email;
            company.account.username = username ? username : company.account.username;
            company.account.firstname = firstname ? firstname : company.account.firstname;
            company.account.lastname = lastname ? lastname : company.account.lastname;
            company.description = description ? description : company.description;
            company.location = Location ? Location : company.location;

            await company.save();
            return res.status(200).send(company)
        } else {
            return res.status(403).send({ error: 'Company not found' })
        }
    } else {
        return res.status(400).json({ error: "you are not authorized" })
    }
})

router.put('/company-hours/:id', isAuthenticated, checkRole(Role.Company), async (req, res) => {
    if (req.headers.authorization && req.user._id && req.params.id) {
        try {
            const company = await Company.findById(req.params.id)
            const currentUserToken = await req.headers.authorization.replace("Bearer ", "");
            if (company && currentUserToken === company.token) {
                const openingHours = req.fields.openingHours;
                company.openingHours.monday.beginHours = openingHours.monday.beginHours ? openingHours.monday.beginHours : company.openingHours.monday.beginHours
                company.openingHours.monday.endHours = openingHours.monday.endHours ? openingHours.monday.endHours : company.openingHours.monday.endHours
                company.openingHours.tuesday.beginHours = openingHours.tuesday.beginHours ? openingHours.tuesday.beginHours : company.openingHours.tuesday.beginHours
                company.openingHours.tuesday.endHours = openingHours.tuesday.endHours ? openingHours.tuesday.endHours : company.openingHours.tuesday.endHours
                company.openingHours.wednesday.beginHours = openingHours.wednesday.beginHours ? openingHours.wednesday.beginHours : company.openingHours.wednesday.beginHours
                company.openingHours.wednesday.endHours = openingHours.wednesday.endHours ? openingHours.wednesday.endHours : company.openingHours.wednesday.endHours
                company.openingHours.thursday.beginHours = openingHours.thursday.beginHours ? openingHours.thursday.beginHours : company.openingHours.thursday.beginHours
                company.openingHours.thursday.endHours = openingHours.thursday.endHours ? openingHours.thursday.endHours : company.openingHours.thursday.endHours
                company.openingHours.friday.beginHours = openingHours.friday.beginHours ? openingHours.friday.beginHours : company.openingHours.friday.beginHours
                company.openingHours.friday.endHours = openingHours.friday.endHours ? openingHours.friday.endHours : company.openingHours.friday.endHours
                company.openingHours.saturday.beginHours = openingHours.saturday.beginHours ? openingHours.saturday.beginHours : company.openingHours.saturday.beginHours
                company.openingHours.saturday.endHours = openingHours.saturday.endHours ? openingHours.saturday.endHours : company.openingHours.saturday.endHours
                company.openingHours.sunday.beginHours = openingHours.sunday.beginHours ? openingHours.sunday.beginHours : company.openingHours.sunday.beginHours
                company.openingHours.sunday.endHours = openingHours.sunday.endHours ? openingHours.sunday.endHours : company.openingHours.sunday.endHours
                await company.save();
                return res.status(200).send('hours up to date');
            } else {
                return res.status(403).send('company not found')
            }
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } else {
        return res.status(401).send('you are not authorized')
    }
});

router.delete('/company-delete/:id', isAuthenticated, checkRole(Role.Company), async (req, res) => {
    if (req.headers.authorization && req.user._id && req.params.id) {
        try {
            const company = await Company.findById(req.params.id)
            const currentUserToken = req.headers.authorization.replace("Bearer ", "");
            if (company && currentUserToken === company.token) {
                const { email, password } = req.fields;

                const newhash = await SHA256(password + company.salt).toString(encBase64);
                if (newhash === company.hash && email === company.email) {
                    const todelete = await Company.findOneAndDelete(req.params.id)
                    return res.status(200).send('company deleted')
                } else {
                    return res.status(401).send('Password is wrong')
                }
            } else {
                return res.status(403).send('company not found')
            }
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } else {
        return res.status(403).send('You are not authorized')
    }
})

module.exports = router; 