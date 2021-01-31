import express, { Request, Response } from 'express'
const router = express.Router();
import SHA256 from 'crypto-js/sha256'
import encBase64 from 'crypto-js/enc-base64'
import User from '../model/User'
import Company from '../model/Company';

router.post('/company-login', async (req: Request, res: Response) => {
    const email : string = req.fields?.email
    const password: string = req.fields?.password
    if (email && password) {
        try {
            const findCompany = await Company.findOne({ email: email })
            if (findCompany) {
                const newhash = SHA256(password + findCompany.salt).toString(encBase64)
                if (newhash === findCompany.hash) {
                    return res.status(200).json({ success: 'you are connected' })
                }
            } else {
                return res.status(400).json({ error: 'Password invalid' })
            }
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } else {
        return res.status(401).json({ error: 'missing parameters' })
    }
})
router.post('/user/login', async (req, res) => {
    const email : string = req.fields?.email
    const password: string = req.fields?.password
    if (email && password) {
        try {
            const userByMail = await User.findOne({ email })
            if (userByMail) {
                const newHash = await SHA256(password + userByMail.salt).toString(encBase64);
                if (newHash === userByMail.hash) {
                    return res.status(200).send({
                        email: userByMail.email,
                        role: userByMail.role,
                        token: userByMail.token,
                        account: userByMail.account,
                    })
                } else
                    return res.status(400).json({ error: 'password incorrect' })
            } else {

                return res.status(400).send('Invalid email')
            }
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } else {
        return res.status(401).json({ error: 'missing parameters' })
    }
});

export default router; 