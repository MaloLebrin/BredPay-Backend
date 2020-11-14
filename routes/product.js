const express = require('express');
const router = express.Router();
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

router.post('/product-create', isAuthenticated, async (req, res) => {
    if (req.fields || req.files.pictures) {
        try {
            const { name, price, quantity, category, weight, description, allergens } = req.fields;
            const newProduct = await new Product({
                productName: name,
                price,
                quantity,
                category,
                weight,
                description,
                allergens,
                company: req.user._id
            })
            const fileKeys = Object.keys(req.files.pictures);
            let results = [];
            if (fileKeys.length === 0) {
                return res.json("No file uploaded!");
            }
            fileKeys.forEach(async (fileKey) => {
                try {
                    const file = req.files.pictures[fileKey];
                    // console.log('file', file.path);
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: `boulangerie/companies/${req.user._id}/products/${newProduct._id}`,
                    });
                    // console.log('result', result);
                    results[fileKey] = { result: result }
                    if (Object.keys(results).length === fileKeys.length) {
                        // console.log('results', results);
                        newProduct.photo = results;
                        const company = await Company.findById(req.user._id)
                        let tab = company.products;
                        tab.push(newProduct._id);
                        await Company.findByIdAndUpdate(req.user._id, { products: tab });
                        await newProduct.save()
                        return res.json(newProduct);
                    }
                } catch (error) {
                    return res.json({ error: error.message });
                }
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } else {
        return res.status(403).json({ error: 'missing parameters' })
    }
})

router.delete('/product-delete/:id', isAuthenticated, async (req, res) => {
    if (req.params) {
        try {
            const productId = req.params.id;
            const product = await Product.findById(req.params.id);
            if (product) {
                // console.log(product.photo);
                const fileKeys = Object.keys(product.photo);
                fileKeys.forEach(async (fileKey) => {
                    try {
                        const file = product.photo[fileKey];
                        await cloudinary.uploader.destroy(file.result.public_id);
                        await cloudinary.api.delete_folder(`boulangerie/companies/${req.user._id}/products/${productId}`,
                            {
                                folder: `boulangerie/companies/${req.user._id}/products/`,
                            });
                        await Product.findByIdAndDelete(productId)
                        return res.status(200).json({ message: 'Product deleted' });
                    } catch (error) {
                        return res.json({ error: error.message });
                    }
                })

            } else {
                return res.status(400).json({ error: "product not found" })
            }
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } else {
        return res.status(403).json({ error: 'missing parameters' })
    }
})
module.exports = router; 