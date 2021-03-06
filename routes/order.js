const express = require('express');
const router = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const Role = require('../middleware/Role')
const checkRole = require('../middleware/checkRole')
const Company = require('../model/Company');
const Product = require('../model/Product');
const Order = require('../model/Order')
const nodemailer = require('nodemailer')

router.get('/orders/all', isAuthenticated, async (req, res) => {
    try {
        if (req.user.role === Role.User) {
            const userOrders = await Order.find({ user: req.user._id })
            return res.status(200).json(userOrders)

        } else if (req.user.role === Role.Company) {
            const companyOrders = await Order.find({ company: req.user._id })
            return res.status(200).json(companyOrders)
        }

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
})
router.delete('/deleteOrder/:id', isAuthenticated, checkRole(Role.Company), async (req, res) => {
    try {
        const { id } = req.params;
        await Order.findByIdAndDelete(id)
        return res.status(200).json({ message: 'Oder deleted successfully' })
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
})
router.post('/new-order', isAuthenticated, checkRole(Role.User), async (req, res) => {
    try {
        const { amount, company, products } = req.fields;

        const newOrder = await new Order({
            date: new Date(),
            amount: Number(amount),
            delivery: false,
            company,
            products,
            user: req.user._id
        })
        await newOrder.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: `${process.env.MAIL_ADRESS}`,
                pass: `${process.env.MAIL_MDP}`
            }
        });
        const mailOptions = {
            from: `${process.env.MAIL_ADRESS}`,
            to: `${req.user.email}`,
            subject: `Confirmation de commande ${newOrder._id}`,
            text: `votre commande a bien été envoyé à la boulangerie`
        };

        transporter.sendMail(mailOptions, () => {
            return res.status(200).json({ order: newOrder })
        })
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
})



module.exports = router;