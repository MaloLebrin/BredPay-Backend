const express = require('express');
const router = express.Router();
const uid2 = require('uid2');
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

router.post('/company-login', async (req, res) => {
    const { email, password } = req.fields;
    if (email && password) {
        try {
            const findCompany = await Company.findOne({ email: email })
            if (findCompany) {
                const newhash = SHA256(password + findCompany.salt).toString(encBase64)
                if (newhash === findCompany.hash) {
                    res.status(200).json({ success: 'you are connected' })
                }
            } else {
                res.status(400).json({ error: 'Password invalid' })
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        res.status(401).json({ error: 'missing parameters' })
    }
})
router.post('/user/login', async (req, res) => {
    const { email, password } = req.fields;
    if (email && password) {
        try {
            const userByMail = await User.findOne({ email })
            if (userByMail) {
                const newHash = await SHA256(password + userByMail.salt).toString(encBase64);
                if (newHash === userByMail.hash) {
                    return res.status(200).send('connection successfull')
                } else
                    return res.status(400).json({ error: 'password incorrect' })
            } else {

                res.status(400).send('Invalid email')
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        res.status(401).json({ error: 'missing parameters' })
    }
});

module.exports = router; 