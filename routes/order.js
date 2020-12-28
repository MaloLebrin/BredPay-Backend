const express = require('express');
const router = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const Role = require('../middleware/Role')
const checkRole = require('../middleware/checkRole')
const Company = require('../model/Company');
const Product = require('../model/Product');
const Order = require('../model/Order')

router.post('/new-order', isAuthenticated, checkRole(Role.User), async (req, res) => {
    try {
        return res.status(200).json('good')
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
})



module.exports = router;